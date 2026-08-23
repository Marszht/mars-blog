---
title: "IndexedDB 实战入门：事务、索引与 TypeScript 封装"
date: "2026-08-23"
excerpt: "用一个可运行的消息存储示例理解 IndexedDB 的版本升级、对象仓库、事务和索引，并避开常见的生命周期问题。"
tags: ["IndexedDB", "TypeScript", "浏览器", "数据库"]
---

当页面只需要保存主题偏好或一个开关时，`localStorage` 足够简单。但如果要缓存大量结构化数据、按字段查询，或保证一组读写要么全部成功、要么全部失败，继续把对象序列化成字符串就会越来越吃力。这正是 IndexedDB 更合适的场景。

本文用一个消息仓库串起 IndexedDB 最重要的部分：版本升级、对象仓库、复合索引、事务，以及多标签页下的连接生命周期。示例只使用浏览器原生 API 和 TypeScript，可以直接移入普通前端项目。

## 什么时候该用 IndexedDB

`localStorage` 和 IndexedDB 都受同源策略约束，但面向的问题不同。

### `localStorage`

- 同步读写，只保存字符串；复杂对象需要自行序列化和解析。
- 通过字符串键直接访问，不提供索引、键范围或跨键事务。
- 更适合少量设置和简单状态。

### IndexedDB

- 基于请求和事件异步工作，避免大量读写长时间占用主线程。
- 可以保存结构化数据，以及 `Blob`、`ArrayBuffer` 等可被结构化克隆的值。
- 支持主键、索引、键范围、游标和事务，适合离线数据、消息、草稿、目录缓存与二进制内容。

存储容量不是一个可以写死的数字。它取决于浏览器策略、设备剩余空间、站点使用情况和用户设置，数据也可能因清理或存储压力被移除。因此，IndexedDB 适合做本地能力和缓存，但不能成为重要数据唯一的副本。

## 六个核心概念

1. **数据库（database）**：同一源下可以有多个具名数据库。`IDBDatabase` 表示一次打开的连接，而不是磁盘文件本身。
2. **版本（version）**：结构变化需要提高整数版本号。以更高版本打开时，浏览器会触发一次升级事务。
3. **对象仓库（object store）**：保存记录的容器，作用近似表，但记录不要求固定列结构。
4. **键与索引（key/index）**：主键唯一标识记录；索引用记录中的其他字段建立查询入口，也可以使用多个字段组成复合索引。
5. **请求（request）**：一次读取、写入或打开动作通常返回 `IDBRequest`，结果通过 `success` 或 `error` 事件到达。
6. **事务（transaction）**：请求必须在事务范围内执行。事务限定可访问的对象仓库和读写模式，并决定整组操作最终提交还是回滚。

可以把它们理解成这条路径：先打开一个带版本的数据库连接，再创建限定范围的事务，通过对象仓库或索引发出请求，最后以事务是否完成判断整组操作的结果。

## 设计一个消息仓库

示例记录只包含公开、通用的字段：

```typescript
interface StoredMessage {
  id: string
  roomId: string
  body: string
  createdAt: number
}
```

对象仓库名为 `messages`，使用 `id` 作为主键。常见读取需求是“获取某个房间的消息，并按时间排序”，因此创建复合索引 `by-room-and-time`，键路径为 `['roomId', 'createdAt']`。

复合索引的顺序很重要：它先按 `roomId` 分组，再按 `createdAt` 排序。这样可以用一个连续键范围取出某个房间的消息，无需把全部记录读进内存再排序。

## 打开数据库与升级结构

数据库结构只能在版本升级事务中修改。第一次打开数据库，或传入的版本高于现有版本时，`upgradeneeded` 事件会触发；创建对象仓库和索引应放在这里。

```typescript
const DB_NAME = 'message-cache'
const DB_VERSION = 1
const STORE_NAME = 'messages'
const ROOM_TIME_INDEX = 'by-room-and-time'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      const upgradeTransaction = request.transaction

      const store = database.objectStoreNames.contains(STORE_NAME)
        ? upgradeTransaction!.objectStore(STORE_NAME)
        : database.createObjectStore(STORE_NAME, { keyPath: 'id' })

      if (!store.indexNames.contains(ROOM_TIME_INDEX)) {
        store.createIndex(
          ROOM_TIME_INDEX,
          ['roomId', 'createdAt'],
          { unique: false },
        )
      }
    }

    request.onsuccess = () => {
      const database = request.result

      database.onversionchange = () => {
        database.close()
        console.info('本地数据库需要升级，当前连接已关闭，请刷新页面。')
      }

      resolve(database)
    }

    request.onblocked = () => {
      console.warn('数据库升级正在等待其他页面释放旧连接。')
    }

    request.onerror = () => {
      reject(request.error ?? new Error('无法打开本地数据库'))
    }
  })
}
```

这里有两个容易忽略的生命周期事件：

- 新页面发起升级时，如果旧页面仍持有连接，新的打开请求会触发 `blocked`，升级要等旧连接关闭。
- 已打开的连接收到 `versionchange`，说明另一个上下文正在请求升级。及时调用 `close()`，才能让新版本继续执行。

`blocked` 不是升级失败，所以示例只提示用户，没有立即拒绝 Promise。旧连接释放后，同一个打开请求仍可继续进入升级和成功阶段。

## 增改、查询和清空

原生 API 的样板代码主要来自事件转 Promise。下面先写两个小工具：一个读取请求结果，一个等待事务结束。

```typescript
function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB 请求失败'))
    }
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => {
      reject(transaction.error ?? new Error('IndexedDB 事务失败'))
    }
    transaction.onabort = () => {
      reject(transaction.error ?? new Error('IndexedDB 事务已中止'))
    }
  })
}
```

接着封装仓库操作。`put()` 会新增记录，或覆盖主键相同的记录；`listByRoom()` 通过复合索引直接按时间顺序返回结果。

```typescript
interface MessageRepository {
  put(message: StoredMessage): Promise<void>
  listByRoom(roomId: string): Promise<StoredMessage[]>
  clear(): Promise<void>
  close(): void
}

async function openMessageRepository(): Promise<MessageRepository> {
  const database = await openDatabase()

  return {
    async put(message) {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const completed = transactionDone(transaction)

      transaction.objectStore(STORE_NAME).put(message)

      await completed
    },

    async listByRoom(roomId) {
      const transaction = database.transaction(STORE_NAME, 'readonly')
      const completed = transactionDone(transaction)
      const index = transaction
        .objectStore(STORE_NAME)
        .index(ROOM_TIME_INDEX)
      const roomRange = IDBKeyRange.bound(
        [roomId, Number.MIN_SAFE_INTEGER],
        [roomId, Number.MAX_SAFE_INTEGER],
      )
      const result = requestResult<StoredMessage[]>(index.getAll(roomRange))

      const [messages] = await Promise.all([result, completed])
      return messages
    },

    async clear() {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const completed = transactionDone(transaction)

      transaction.objectStore(STORE_NAME).clear()

      await completed
    },

    close() {
      database.close()
    },
  }
}
```

调用时，应用可以在自身生命周期结束处关闭连接：

```typescript
const messages = await openMessageRepository()

await messages.put({
  id: crypto.randomUUID(),
  roomId: 'general',
  body: '你好，IndexedDB',
  createdAt: Date.now(),
})

const history = await messages.listByRoom('general')
console.table(history)

// 例如在应用卸载、Worker 结束或不再使用仓库时调用。
messages.close()
```

## 事务为什么容易踩坑

一次 `put()` 请求成功，只表示这次请求完成，并不等于它所在的事务已经成功提交。事务仍可能因后续请求失败或被主动中止而回滚。因此，写操作应在 `transaction.oncomplete` 时 resolve，并同时处理 `error` 和 `abort`。

事务的活跃时间也比很多人预想得短。浏览器会在创建事务的任务中，以及其请求回调对应的任务中允许继续排队请求；当事务没有待处理请求时，它会自动提交。在事务中插入与数据库无关的异步等待，回来后再发请求，可能得到 `TransactionInactiveError`。

```typescript
// 不推荐：网络等待不属于这次数据库事务。
const transaction = database.transaction(STORE_NAME, 'readwrite')
const response = await fetch('/messages/latest')
const message = await response.json()
transaction.objectStore(STORE_NAME).put(message)
```

更稳妥的做法是先完成网络请求和数据校验，再开启一个短事务，并同步排入所有数据库请求：

```typescript
const response = await fetch('/messages/latest')
const message: StoredMessage = await response.json()

const transaction = database.transaction(STORE_NAME, 'readwrite')
const completed = transactionDone(transaction)
transaction.objectStore(STORE_NAME).put(message)
await completed
```

还要区分两个错误层级：request 的 `error` 事件描述某一次操作失败；如果没有阻止其默认行为，错误通常会向事务冒泡并中止事务。仓库级 API 最终应以事务结果为准，必要时再读取具体 request 的错误，提供更精确的提示。

## 多标签页与版本升级

假设旧标签页持有版本 1 的连接，新标签页部署了版本 2，并执行 `indexedDB.open(DB_NAME, 2)`：

1. 浏览器通知现有连接发生 `versionchange`。
2. 旧页面关闭连接后，新页面才能取得独占的升级事务。
3. 如果仍有连接未关闭，新页面的打开请求触发 `blocked` 并等待。
4. 升级事务完成后，新的打开请求才触发 `success`。

因此，连接建立后注册 `versionchange` 并关闭数据库，不是可有可无的清理动作，而是让多标签页顺利升级的协作协议。实际产品还可以在关闭后展示“页面已有新版本，请刷新”的界面，避免旧代码继续发起新事务。

每次结构变更都应提高版本并写成可重复理解的迁移步骤。不要在普通读写事务中创建或删除对象仓库、索引；这些结构操作只能在升级事务中进行。

## 错误处理与配额

本地写入可能因数据不可克隆、约束冲突、事务失活、用户设置或可用空间不足而失败。业务层至少要做到：

- 捕获打开和事务错误，给出可恢复的界面状态；
- 把服务端仍有权威副本的数据视为缓存，而不是永久保存；
- 对离线创建且尚未同步的数据制定重试、导出或冲突处理策略；
- 不依赖单一固定容量，也不把“当前还能写入”当作未来保证。

需要展示大致用量时，可以读取 Storage API 的估算值：

```typescript
async function getStorageEstimate() {
  if (!navigator.storage?.estimate) {
    return null
  }

  const { usage, quota } = await navigator.storage.estimate()
  return { usage, quota }
}
```

`usage` 和 `quota` 都是当前源的近似值，可能经过压缩、去重或隐私处理，也会随环境变化。它们适合做监控和提示，不是容量承诺，更不是 IndexedDB 单独占用的精确账单。

## 选择原生 API 还是封装库

原生 IndexedDB 适合学习底层模型、控制依赖，或只需要少量稳定操作的项目。它的代价是事件转 Promise、版本迁移和事务边界都要自己维护。

当仓库较多、查询复杂或迁移频繁时，可以评估 `idb` 这类薄封装。它能减少样板代码，但不会替你决定数据模型、索引顺序、升级策略和失败后的业务处理。无论使用哪种库，理解事务何时活跃、何时完成，以及连接为何会阻塞升级，仍然是避免数据问题的关键。

本文没有为项目增加依赖；示例保持为浏览器原生实现，方便看清每个生命周期事件来自哪里。

## 检查清单

- 结构变化只发生在 `upgradeneeded`，并同步提高数据库版本。
- 对象仓库有稳定主键，索引顺序匹配实际查询方式。
- 写操作等待事务 `complete`，同时处理 `error` 和 `abort`。
- 事务开启后立即排入数据库请求，不在中间等待网络或其他无关任务。
- 已打开的连接会在 `versionchange` 时关闭，并为 `blocked` 提供用户提示。
- 重要数据在其他位置有可靠副本或明确的同步、恢复策略。
- 存储用量只作为估算，不依赖固定额度。

延伸阅读：

- [IndexedDB API 概览（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [`upgradeneeded` 事件（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/upgradeneeded_event)
- [`StorageManager.estimate()`（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate)
