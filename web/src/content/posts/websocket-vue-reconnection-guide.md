---
title: "Vue 3 中构建可靠的 WebSocket 连接"
date: "2026-08-23"
excerpt: "从连接状态、消息队列到主动关闭与指数退避，完整实现一个不会重复重连、能正确清理资源的 Vue 3 WebSocket composable。"
tags: ["WebSocket", "Vue 3", "TypeScript", "网络"]
---

实时通知、协同编辑、在线状态这类功能有一个共同点：服务端产生变化后，客户端希望尽快知道。建立 WebSocket 连接并不难，难的是处理连接之外的事情，例如断网、路由切换、重复点击、消息暂存和服务恢复。本文从浏览器 API 的边界出发，实现一个能明确回答这些问题的 Vue 3 composable。

## WebSocket 解决什么问题

传统的请求-响应轮询由客户端定期询问服务端。它容易理解，也适合更新不频繁、允许一定延迟的场景；代价是即使没有新数据，也会持续产生请求。

WebSocket 建立连接后，客户端和服务端可以在同一条连接上双向发送消息。对于更新频繁、延迟敏感的交互，它通常比高频轮询更自然。不过，WebSocket 不是“所有实时功能的唯一答案”：Server-Sent Events 和基于 Fetch 的流式响应同样能把数据从服务端持续传给客户端，只是通信方向、浏览器支持和协议控制方式不同。

因此，选择 WebSocket 的关键理由应当是**需要持久、低延迟的双向通信**，而不是“HTTP 无法推送数据”。

## 浏览器 API 的边界

创建 `WebSocket` 实例后，浏览器立即开始连接。业务代码主要围绕四个事件工作：

- **`open`：握手完成，可以发送数据。** 更新状态、清零连续失败次数、发送暂存消息。
- **`message`：收到服务端消息。** 校验数据格式，再交给业务处理。
- **`error`：连接过程发生错误。** 记录诊断信息；是否重连由 `close` 统一决定。
- **`close`：连接已关闭。** 区分主动关闭与意外断开，再决定是否重连。

`readyState` 则提供 `CONNECTING`、`OPEN`、`CLOSING` 和 `CLOSED` 四个底层状态。调用 `send()` 只是把数据交给浏览器的发送缓冲区，并不等于服务端已经收到。文本会以字符串交付；二进制消息可以使用 `Blob`、`ArrayBuffer` 或视图类型，接收形式可通过 `binaryType` 调整。

浏览器提供的是连接和消息传输能力。以下能力需要客户端与服务端共同定义应用协议：

- 断线后是否重连，以及重连多久后停止；
- 身份凭据何时续期，失效后如何恢复；
- 如何检测“连接仍在，但对端已经不可用”；
- 消息是否需要确认、去重、重放和持久化；
- 跨多次连接的业务顺序如何维持。

可以从 [MDN WebSocket API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API) 和 [MDN WebSocket 客户端指南](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) 查看原生接口的完整行为。

## 先定义状态和配置

不要直接把 `readyState` 当成界面状态。浏览器只知道连接是否打开，界面还关心“首次连接”和“正在重试”的差别。因此先定义一组面向业务的状态：

```typescript
type SocketState = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

interface UseWebSocketOptions {
  url: string
  maxReconnectAttempts?: number
  baseReconnectDelayMs?: number
  maxReconnectDelayMs?: number
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
}
```

- `idle`：组件已经创建，但尚未挂载和建连；
- `connecting`：正在进行首次连接；
- `open`：连接可用；
- `reconnecting`：意外断开后，正在等待或发起下一次连接；
- `closed`：主动关闭，或者重试次数已经用完。

这个划分同时给实现设下约束：任何时刻只允许一个正在连接或已经打开的实例，并且只有意外断开才能进入 `reconnecting`。

## 实现可靠的 composable

下面的实现可以放进 `useWebSocket.ts`。它选择了一个明确的队列策略：队列属于当前组件实例，调用 `close()` 时会清空。这样路由离开后，旧页面尚未发送的操作不会混入下一次会话。如果业务需要跨页面保留消息，应把队列提升到独立存储层，而不是删除这里的清理逻辑。

```typescript
import { onMounted, onUnmounted, readonly, ref, shallowRef } from 'vue'

type SocketState = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

interface UseWebSocketOptions {
  url: string
  maxReconnectAttempts?: number
  baseReconnectDelayMs?: number
  maxReconnectDelayMs?: number
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
}

type WebSocketPayload = Parameters<WebSocket['send']>[0]

export function useWebSocket(options: UseWebSocketOptions) {
  const maxReconnectAttempts = Math.max(
    0,
    Math.floor(options.maxReconnectAttempts ?? 5),
  )
  const baseReconnectDelayMs = Math.max(
    100,
    options.baseReconnectDelayMs ?? 1_000,
  )
  const maxReconnectDelayMs = Math.max(
    baseReconnectDelayMs,
    options.maxReconnectDelayMs ?? 30_000,
  )

  const state = ref<SocketState>('idle')
  const reconnectAttempts = ref(0)
  const socket = shallowRef<WebSocket | null>(null)
  const messageQueue: WebSocketPayload[] = []

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let manuallyClosed = false

  function clearReconnectTimer() {
    if (reconnectTimer === null)
      return

    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  function detachListeners(current: WebSocket) {
    current.onopen = null
    current.onmessage = null
    current.onerror = null
    current.onclose = null
  }

  function flushQueue(current: WebSocket) {
    while (
      messageQueue.length > 0
      && current.readyState === WebSocket.OPEN
    ) {
      current.send(messageQueue[0])
      messageQueue.shift()
    }
  }

  function scheduleReconnect() {
    if (manuallyClosed || reconnectAttempts.value >= maxReconnectAttempts) {
      state.value = 'closed'
      return
    }

    reconnectAttempts.value += 1
    state.value = 'reconnecting'

    const exponentialDelay
      = baseReconnectDelayMs * 2 ** (reconnectAttempts.value - 1)
    const jitter = 0.8 + Math.random() * 0.4
    const delay = Math.min(
      maxReconnectDelayMs,
      Math.round(exponentialDelay * jitter),
    )

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      if (!manuallyClosed)
        openSocket(true)
    }, delay)
  }

  function openSocket(isReconnect: boolean) {
    const current = socket.value
    if (
      current?.readyState === WebSocket.CONNECTING
      || current?.readyState === WebSocket.OPEN
    ) {
      return
    }

    state.value = isReconnect ? 'reconnecting' : 'connecting'

    const nextSocket = new WebSocket(options.url)
    socket.value = nextSocket

    nextSocket.onopen = () => {
      if (socket.value !== nextSocket)
        return

      state.value = 'open'
      reconnectAttempts.value = 0
      flushQueue(nextSocket)
    }

    nextSocket.onmessage = (event) => {
      if (socket.value === nextSocket)
        options.onMessage?.(event)
    }

    nextSocket.onerror = (event) => {
      if (socket.value === nextSocket)
        options.onError?.(event)
    }

    nextSocket.onclose = () => {
      if (socket.value !== nextSocket)
        return

      socket.value = null
      detachListeners(nextSocket)

      if (manuallyClosed) {
        state.value = 'closed'
        return
      }

      scheduleReconnect()
    }
  }

  function connect() {
    const current = socket.value
    if (
      current?.readyState === WebSocket.CONNECTING
      || current?.readyState === WebSocket.OPEN
    ) {
      return
    }

    clearReconnectTimer()
    manuallyClosed = false
    reconnectAttempts.value = 0
    openSocket(false)
  }

  function send(data: WebSocketPayload) {
    const current = socket.value
    if (current?.readyState === WebSocket.OPEN) {
      current.send(data)
      return true
    }

    if (!manuallyClosed)
      messageQueue.push(data)

    return false
  }

  function close() {
    manuallyClosed = true
    clearReconnectTimer()

    const current = socket.value
    socket.value = null

    if (current) {
      if (
        current.readyState === WebSocket.CONNECTING
        || current.readyState === WebSocket.OPEN
      ) {
        current.close(1000, 'Client closed')
      }
      detachListeners(current)
    }

    messageQueue.length = 0
    state.value = 'closed'
  }

  onMounted(connect)
  onUnmounted(close)

  return {
    state: readonly(state),
    reconnectAttempts: readonly(reconnectAttempts),
    connect,
    send,
    close,
  }
}
```

这里有两个容易忽略的细节。第一，事件处理器捕获了创建它的 `nextSocket`，每次执行前都确认它仍是当前实例。即使旧连接的事件晚到，也不会覆盖新连接的状态。第二，`error` 只负责上报；重连统一从 `close` 触发，从而避免一次故障同时创建两个定时器。

`send()` 返回 `true` 只代表数据已交给当前连接的浏览器缓冲区。返回 `false` 时，数据可能进入本地队列；主动关闭之后再调用则会被丢弃。无论返回什么，它都不代表服务端已经处理消息。

## 为什么主动关闭不能触发重连

只判断关闭码并不够。服务端也可以使用正常关闭码结束连接，而主动关闭可能因为网络变化呈现为其他结果。真正可靠的依据是客户端意图。

`manuallyClosed` 在 `close()` 的第一行被设为 `true`，然后重连定时器被取消。意外关闭路径中的 `onclose` 只有在这个标记为 `false` 时才会安排下一次连接。公开的 `connect()` 会重新清除该标记，因此手动关闭后仍然可以显式开启新会话。

卸载时直接调用 `onUnmounted(close)`，连接、回调引用、重连定时器和当前组件的消息队列都会被释放。Vue 官方也把计时器、事件监听器和服务端连接列为应在 [`onUnmounted`](https://cn.vuejs.org/api/composition-api-lifecycle.html#onunmounted) 中清理的副作用。

## 消息队列与交付语义

本地队列只解决一个小问题：连接暂时不可用时，不立即丢掉调用方提交的数据；连接成功后，按照插入顺序再次调用 `send()`。它没有解决以下问题：

- 浏览器接受数据后、服务端收到前，连接再次中断；
- 服务端已经处理消息，但确认响应在断线时丢失；
- 客户端重试后，服务端收到同一条业务消息两次；
- 服务端异步处理导致完成顺序与接收顺序不同。

需要更强交付保证时，可以给每条业务消息分配稳定的消息编号，由服务端返回应用层确认并按编号去重；重要消息还要持久化未确认状态。即使这样，也应优先设计幂等操作，而不是轻率承诺“恰好一次”。

队列还必须有限制。示例为了突出连接生命周期没有加入容量参数；实际项目应根据消息价值设置数量或字节上限，明确溢出时是拒绝新消息、淘汰旧消息，还是转存到持久化存储。

## 重连策略

固定间隔重连会让大量客户端在服务恢复时同时发起连接。示例采用带随机抖动的指数退避：

```text
delay = min(maxDelay, baseDelay * 2^(attempt - 1) * jitter)
jitter = 0.8 ... 1.2
```

默认延迟从约 1 秒开始增长，最长不超过 30 秒，最多连续尝试 5 次。随机抖动让不同客户端的请求时间稍微错开，上限则保证等待不会无限增长。

一次连接成功后，连续失败次数归零。达到上限后状态进入 `closed`，由界面显示重试入口，用户显式调用 `connect()` 才开始新一轮。这里的上限是保护服务端和客户端的策略参数，不是协议规定；前台聊天和后台数据面板可以有不同选择。

## 认证、心跳和页面生命周期

这些功能不适合偷偷塞进通用封装，需要先与服务端约定：

**认证。** 浏览器的 WebSocket 构造器不能像普通请求一样自由添加请求头。常见方案是使用同站点 Cookie，或先通过 HTTPS 获取短时、一次性的连接凭据。不要把长期凭据放进 URL，因为 URL 可能进入日志。凭据过期时，服务端应发送可识别的业务错误或关闭连接；客户端刷新凭据后再显式建立新连接。若地址需要动态生成，可把 `url` 扩展为每次连接时调用的函数。

**心跳。** 浏览器 API 不会替业务层判断连接是否“可用”。客户端可以定期发送应用层心跳消息，并要求服务端在期限内回应。定时器间隔、超时阈值以及后台标签页的节流都要纳入设计；收到超时后关闭当前实例，让统一的 `close` 事件路径决定是否重连。

**页面生命周期。** 组件级连接由 `onMounted` 创建、由 `onUnmounted` 释放。若连接属于整个应用，应把 composable 放在应用级所有者中，避免多个页面各自建连。对于需要浏览器前进后退缓存的页面，还可在应用根部处理 `pagehide` 和 `pageshow`；MDN 提醒，保持 WebSocket 打开可能影响页面进入该缓存。

**网络状态。** `online` 事件可以用于提前触发一次显式连接，`offline` 可以更新界面提示，但它们只是浏览器对网络状态的线索，不能证明服务端一定可达。最终仍要以连接事件、心跳和服务端确认为准。

## 测试清单

- 正常打开连接，状态依次从 `idle` 变为 `connecting`、`open`。
- 在 `CONNECTING` 和 `OPEN` 阶段连续调用 `connect()`，始终只有一个连接实例。
- 服务端断开或连接失败后，只创建一个重连定时器，退避时间受上限约束。
- 模拟离线再恢复，消息按入队顺序发送，重连次数在成功后归零。
- 快速进入、离开同一路由，旧连接的迟到事件不会修改新组件状态。
- 调用 `close()` 或卸载组件后，不再重连，队列被清空。
- 收到格式错误的消息时，业务解析捕获错误，不让连接管理逻辑崩溃。
- 凭据过期后，界面能提示或重新认证，不会无限快速重连。
- 达到最大尝试次数后进入 `closed`，显式操作可以开启新一轮连接。

可靠的 WebSocket 客户端，本质上不是更多回调，而是更清楚的所有权：谁创建连接、谁允许重试、谁保存未发送消息、谁负责清理。先把这些问题写成约束，再写代码，实时功能才不会在网络最差的时候暴露生命周期漏洞。
