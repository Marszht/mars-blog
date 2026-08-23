# Notion First-Batch Article Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish five polished, self-contained technical articles from the private Notion `Docs` workspace without exposing employer, project, account, or personal information.

**Architecture:** Add five independent Markdown documents to the existing file-based blog. Keep the current `gray-matter` loader, `react-markdown` renderer, blog routes, and sitemap unchanged; validate the new content through the same build path used in production.

**Tech Stack:** Markdown, YAML frontmatter, Next.js 15, React 19, TypeScript, `gray-matter`, `react-markdown`

---

## File Map

Create only these content files:

- `web/src/content/posts/frontend-code-review-guide.md` — review workflow, checklist, feedback levels, and adoption path.
- `web/src/content/posts/websocket-vue-reconnection-guide.md` — WebSocket mental model and resilient Vue 3 composable.
- `web/src/content/posts/indexeddb-practical-guide.md` — IndexedDB concepts and self-contained TypeScript wrapper.
- `web/src/content/posts/chrome-devtools-debugging-tips.md` — repeatable DevTools debugging workflows and platform-aware shortcuts.
- `web/src/content/posts/frontend-engineering-practices.md` — progressive engineering maturity path from local checks to delivery and observability.

Do not modify `web/src/lib/posts.ts`, `web/src/components/Markdown.tsx`, blog routes, sitemap code, Notion pages, or the user's existing `README.md` change.

## Shared Editorial Rules

- Write for a frontend developer who knows JavaScript and TypeScript but may not know the specific browser API or team practice.
- Use Chinese prose, ASCII punctuation inside code, and fenced code blocks with language identifiers.
- Use `2026-08-23` as the publication date and never describe it as the original research date.
- Prefer public primary documentation links. Do not link to Notion, private systems, AI chat sessions, expiring S3 assets, scraped mirrors, or internal repositories.
- Remove employer and product terms, internal boards and domains, financial workflows, identity verification, private field names, staffing details, and claims of production use that the notes do not establish.
- Replace private examples with generic messages, profiles, carts, notifications, and adapters.
- Do not introduce images in this batch. Explain workflows with prose, code, Markdown tables, or text diagrams.

### Task 1: Frontend Code Review Article

**Files:**
- Create: `web/src/content/posts/frontend-code-review-guide.md`

- [ ] **Step 1: Verify the slug is currently absent**

Run:

```bash
test ! -e web/src/content/posts/frontend-code-review-guide.md
```

Expected: exit code 0.

- [ ] **Step 2: Create the frontmatter and article structure**

Use this exact frontmatter:

```markdown
---
title: "前端 Code Review 实践：从本地检查到团队协作"
date: "2026-08-23"
excerpt: "一套可渐进落地的前端 Code Review 方法：自动化检查负责确定性问题，人工审查聚焦逻辑、边界、安全与可维护性。"
tags: ["Code Review", "工程化", "TypeScript", "代码质量"]
---
```

Write the article in this order:

1. `为什么 Code Review 经常失效` — distinguish formatting debates, oversized changes, missing context, and rubber-stamp approval.
2. `先划清机器和人的边界` — table mapping formatting/types/tests/security scans to automation and logic/architecture/product behavior to people.
3. `一条可执行的审查流水线` — local checks, CI checks, author self-review, reviewer review, merge.
4. `作者提交前要提供什么` — purpose, impact, test evidence, screenshots for UI changes, and areas of uncertainty.
5. `Reviewer 检查清单` — correctness, edge cases, async/error handling, security, performance, maintainability, accessibility, and cross-platform behavior.
6. `如何写有用的评论` — use `blocking`, `suggestion`, `question`, and `nit` labels with one generic example each.
7. `关于改动大小和函数长度` — describe change size and function length as warning signals, not universal numerical gates.
8. `小团队如何渐进落地` — week-by-week adoption without claiming a specific real team used it.
9. `最后的最小清单` — author and reviewer checkboxes.

Include these safe examples:

```typescript
// The name explains why the branch exists.
const shouldRefreshProfile = profile.updatedAt < session.startedAt

if (shouldRefreshProfile) {
  await refreshProfile()
}
```

```typescript
try {
  const cart = await loadCart()
  renderCart(cart)
} catch (error) {
  reportError(error)
  showMessage('购物车加载失败，请稍后重试')
}
```

The article must not contain employer names, private board URLs, financial calculations, face recognition, hybrid-container parameter names, or fixed claims that every diff over 400 lines or function over 80 lines is invalid.

- [ ] **Step 3: Run the focused privacy and residue scan**

Run:

```bash
rg -n -i 'notion|claude\.ai|gffunds|kanban|faceauth|idnum|appsecret|token|password|待确定|回去试|todo|tbd|prod-files-secure|x-amz-' web/src/content/posts/frontend-code-review-guide.md
```

Expected: no output and exit code 1.

- [ ] **Step 4: Check Markdown delimiters and frontmatter**

Run:

```bash
node -e "const fs=require('fs');const matter=require('./web/node_modules/gray-matter');const f='web/src/content/posts/frontend-code-review-guide.md';const p=matter(fs.readFileSync(f,'utf8'));for(const k of ['title','date','excerpt','tags'])if(!p.data[k])throw new Error('missing '+k);if((p.content.match(/```/g)||[]).length%2)throw new Error('unclosed fence');console.log(p.data.title)"
```

Expected: prints `前端 Code Review 实践：从本地检查到团队协作`.

- [ ] **Step 5: Commit the article**

```bash
git add web/src/content/posts/frontend-code-review-guide.md
git commit -m "docs: add frontend code review guide"
```

### Task 2: WebSocket Article

**Files:**
- Create: `web/src/content/posts/websocket-vue-reconnection-guide.md`

- [ ] **Step 1: Verify the slug is currently absent**

Run:

```bash
test ! -e web/src/content/posts/websocket-vue-reconnection-guide.md
```

Expected: exit code 0.

- [ ] **Step 2: Create the frontmatter and article structure**

Use this exact frontmatter:

```markdown
---
title: "Vue 3 中构建可靠的 WebSocket 连接"
date: "2026-08-23"
excerpt: "从连接状态、消息队列到主动关闭与指数退避，完整实现一个不会重复重连、能正确清理资源的 Vue 3 WebSocket composable。"
tags: ["WebSocket", "Vue 3", "TypeScript", "网络"]
---
```

Write the article in this order:

1. `WebSocket 解决什么问题` — contrast request-response polling with a persistent full-duplex connection without claiming HTTP cannot support server-to-client streaming.
2. `浏览器 API 的边界` — connection, events, text/binary messages; explain that heartbeat, authentication refresh, reconnection, ordering, and delivery guarantees belong to the application protocol.
3. `先定义状态和配置` — `idle`, `connecting`, `open`, `reconnecting`, `closed`.
4. `实现可靠的 composable` — provide a complete `useWebSocket` implementation.
5. `为什么主动关闭不能触发重连` — explain the `manuallyClosed` flag.
6. `消息队列与交付语义` — warn that queueing does not provide server acknowledgement or exactly-once delivery.
7. `重连策略` — capped exponential backoff with jitter and a maximum attempt count.
8. `认证、心跳和页面生命周期` — describe application-specific extensions.
9. `测试清单` — normal open, server failure, offline/online, rapid route changes, manual close, malformed message, and auth expiration.

The central implementation must use these invariants:

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

- `connect()` returns early for `CONNECTING` and `OPEN` sockets.
- `close()` sets `manuallyClosed`, clears the reconnect timer, closes the socket with code `1000`, and empties the queue only when the article explicitly chooses that policy.
- `onclose` schedules reconnection only when closure was not manual and attempts remain.
- successful connection resets the attempt counter and flushes queued messages in insertion order.
- `onUnmounted(close)` releases the socket and timer.
- the article links to MDN WebSocket API and Vue `onUnmounted` documentation.

- [ ] **Step 3: Run the focused privacy and residue scan**

Run:

```bash
rg -n -i 'notion|gffunds|kanban|chatmessage|@/views|appsecret|token|password|待确定|todo|tbd|prod-files-secure|x-amz-' web/src/content/posts/websocket-vue-reconnection-guide.md
```

Expected: no output and exit code 1. The prose may discuss authentication conceptually without using credential examples.

- [ ] **Step 4: Parse frontmatter and check code fences**

Run:

```bash
node -e "const fs=require('fs');const matter=require('./web/node_modules/gray-matter');const f='web/src/content/posts/websocket-vue-reconnection-guide.md';const p=matter(fs.readFileSync(f,'utf8'));for(const k of ['title','date','excerpt','tags'])if(!p.data[k])throw new Error('missing '+k);if((p.content.match(/```/g)||[]).length%2)throw new Error('unclosed fence');console.log(p.data.title)"
```

Expected: prints `Vue 3 中构建可靠的 WebSocket 连接`.

- [ ] **Step 5: Commit the article**

```bash
git add web/src/content/posts/websocket-vue-reconnection-guide.md
git commit -m "docs: add reliable WebSocket guide"
```

### Task 3: IndexedDB Article

**Files:**
- Create: `web/src/content/posts/indexeddb-practical-guide.md`

- [ ] **Step 1: Verify the slug is currently absent**

Run `test ! -e web/src/content/posts/indexeddb-practical-guide.md` and expect exit code 0.

- [ ] **Step 2: Create the frontmatter and article structure**

Use this exact frontmatter:

```markdown
---
title: "IndexedDB 实战入门：事务、索引与 TypeScript 封装"
date: "2026-08-23"
excerpt: "用一个可运行的消息存储示例理解 IndexedDB 的版本升级、对象仓库、事务和索引，并避开常见的生命周期问题。"
tags: ["IndexedDB", "TypeScript", "浏览器", "数据库"]
---
```

Write the article in this order:

1. `什么时候该用 IndexedDB` — compare it with `localStorage` using async behavior, structured data, indexes, transactions, and binary values; avoid a fixed quota number.
2. `六个核心概念` — database, version, object store, key, index, transaction/request.
3. `设计一个消息仓库` — define a local record and indexes.
4. `打开数据库与升级结构` — `indexedDB.open`, `onupgradeneeded`, `onsuccess`, `onblocked`, and `versionchange` closure.
5. `增改、查询和清空` — complete promise wrappers around transaction completion.
6. `事务为什么容易踩坑` — transaction activity, request errors, aborts, and avoiding unrelated `await` work inside a transaction.
7. `多标签页与版本升级` — explain blocked upgrades and closing stale connections.
8. `错误处理与配额` — use `navigator.storage.estimate()` as an estimate, not a promise of capacity.
9. `选择原生 API 还是封装库` — explain when a library such as `idb` can reduce ceremony, without adding a project dependency.
10. `检查清单`.

Use this public, self-contained record type:

```typescript
interface StoredMessage {
  id: string
  roomId: string
  body: string
  createdAt: number
}
```

The code must create an object store named `messages` with `keyPath: 'id'` and an index named `by-room-and-time` on `['roomId', 'createdAt']`. Resolve writes from `transaction.oncomplete`, reject on `transaction.onerror` and `transaction.onabort`, and close the database when it receives `versionchange`.

Link to the MDN IndexedDB API overview, `IDBOpenDBRequest.onupgradeneeded`, and StorageManager `estimate()` documentation.

- [ ] **Step 3: Run the focused privacy and residue scan**

Run:

```bash
rg -n -i 'notion|gffunds|kanban|@/views|chatbox|appsecret|token|password|250mb|没有上限|待确定|todo|tbd|prod-files-secure|x-amz-' web/src/content/posts/indexeddb-practical-guide.md
```

Expected: no output and exit code 1.

- [ ] **Step 4: Parse frontmatter and check code fences**

Run:

```bash
node -e "const fs=require('fs');const matter=require('./web/node_modules/gray-matter');const f='web/src/content/posts/indexeddb-practical-guide.md';const p=matter(fs.readFileSync(f,'utf8'));for(const k of ['title','date','excerpt','tags'])if(!p.data[k])throw new Error('missing '+k);if((p.content.match(/```/g)||[]).length%2)throw new Error('unclosed fence');console.log(p.data.title)"
```

Expected: prints `IndexedDB 实战入门：事务、索引与 TypeScript 封装`.

- [ ] **Step 5: Commit the article**

```bash
git add web/src/content/posts/indexeddb-practical-guide.md
git commit -m "docs: add practical IndexedDB guide"
```

### Task 4: Chrome DevTools Article

**Files:**
- Create: `web/src/content/posts/chrome-devtools-debugging-tips.md`

- [ ] **Step 1: Verify the slug is currently absent**

Run `test ! -e web/src/content/posts/chrome-devtools-debugging-tips.md` and expect exit code 0.

- [ ] **Step 2: Create the frontmatter and article structure**

Use this exact frontmatter:

```markdown
---
title: "Chrome DevTools 调试技巧：从定位元素到追踪请求"
date: "2026-08-23"
excerpt: "围绕真实排障流程整理 Chrome DevTools：元素与样式、全局搜索、条件断点、Network 请求分析、Console 辅助变量和设备模拟。"
tags: ["Chrome", "DevTools", "调试", "效率"]
---
```

Write the article around workflows rather than a shortcut dump:

1. `先掌握两个入口` — inspect mode and Command Menu, with Mac and Windows/Linux shortcut columns.
2. `元素和样式为什么不对` — inspect, toggle declarations, force state, box model, edit values, hide/remove differences, undo.
3. `代码到底从哪里执行` — file search, global search, pretty print, event listener breakpoints, XHR/fetch breakpoints, conditional breakpoints, logpoints.
4. `请求为什么慢或失败` — filters, status/timing, initiator, payload/response, copy as fetch, replay guidance, throttling, cache controls.
5. `Console 不只会 console.log` — `$0`, `$_`, `copy`, `console.table`, `console.dir`, `console.assert`, and top-level `await` with context caveats.
6. `模拟真实设备条件` — viewport, touch, network, CPU, sensors, and the limits of emulation.
7. `截图与问题记录` — full-size screenshot from Command Menu and the evidence to capture for a reproducible report.
8. `高频排障顺序` — a concise decision flow.

Use official Chrome DevTools documentation links for keyboard shortcuts, JavaScript debugging, Network inspection, Console utilities, device mode, and Command Menu.

Explicitly exclude `$i`, `--disable-web-security`, unverified Workspace behavior, Windows-only executable paths, and claims that hiding an element is identical to changing `visibility` in every situation.

- [ ] **Step 3: Run the focused privacy, unsafe-command, and residue scan**

Run:

```bash
rg -n -i 'notion|gffunds|kanban|\$i|disable-web-security|user-data-dir|program files|待确定|好像|回去试|todo|tbd|prod-files-secure|x-amz-' web/src/content/posts/chrome-devtools-debugging-tips.md
```

Expected: no output and exit code 1.

- [ ] **Step 4: Parse frontmatter and check code fences**

Run:

```bash
node -e "const fs=require('fs');const matter=require('./web/node_modules/gray-matter');const f='web/src/content/posts/chrome-devtools-debugging-tips.md';const p=matter(fs.readFileSync(f,'utf8'));for(const k of ['title','date','excerpt','tags'])if(!p.data[k])throw new Error('missing '+k);if((p.content.match(/```/g)||[]).length%2)throw new Error('unclosed fence');console.log(p.data.title)"
```

Expected: prints `Chrome DevTools 调试技巧：从定位元素到追踪请求`.

- [ ] **Step 5: Commit the article**

```bash
git add web/src/content/posts/chrome-devtools-debugging-tips.md
git commit -m "docs: add Chrome DevTools debugging guide"
```

### Task 5: Frontend Engineering Article

**Files:**
- Create: `web/src/content/posts/frontend-engineering-practices.md`

- [ ] **Step 1: Verify the slug is currently absent**

Run `test ! -e web/src/content/posts/frontend-engineering-practices.md` and expect exit code 0.

- [ ] **Step 2: Create the frontmatter and article structure**

Use this exact frontmatter:

```markdown
---
title: "前端工程化实践：从项目约定到 CI/CD"
date: "2026-08-23"
excerpt: "前端工程化不是工具清单，而是一条降低重复劳动和交付风险的渐进路径：可复现环境、静态检查、测试、构建、CI/CD 与可观测性。"
tags: ["前端工程化", "CI/CD", "工程质量", "团队协作"]
---
```

Write the article in this order:

1. `工程化解决的是反馈成本` — define engineering as repeatable feedback and delivery, not tool accumulation.
2. `第一级：项目可复现` — runtime version, package manager, lockfile, scripts, environment-variable contract, and README.
3. `第二级：本地反馈自动化` — formatter, linter, type checks, focused tests, and pre-commit scope.
4. `第三级：构建与依赖可控` — deterministic install, production build, bundle awareness, dependency updates, and artifact ownership.
5. `第四级：CI 成为合并门槛` — install, lint, types, tests, build, security scan, and branch protection.
6. `第五级：部署可回滚` — immutable artifact, environment configuration, health check, progressive release, rollback.
7. `第六级：上线后有反馈` — errors, performance, logs, release markers, and actionable alerts.
8. `小团队的渐进路线` — minimum baseline, growing project, and multi-team stages in a table.
9. `如何判断一项工具值不值得引入` — problem frequency, feedback speed, maintenance cost, ownership, and exit path.
10. `一份最小工程化清单`.

Include a neutral CI flow:

```text
install -> lint -> typecheck -> test -> build -> package
                                             |
                                             v
                                    deploy -> verify -> rollback
```

Do not claim that a particular company lacks automation, recommend a universal framework, confuse ESM file extensions (`.mjs`) with CommonJS (`.cjs`), or imply that CI/CD alone guarantees quality.

- [ ] **Step 3: Run the focused privacy and residue scan**

Run:

```bash
rg -n -i 'notion|gffunds|kanban|目前公司|我们公司|内部|appsecret|token|password|待确定|todo|tbd|prod-files-secure|x-amz-' web/src/content/posts/frontend-engineering-practices.md
```

Expected: no output and exit code 1. The word `内部` may be used only if a manual review confirms it describes a generic technical boundary rather than a private organization; otherwise rephrase it.

- [ ] **Step 4: Parse frontmatter and check code fences**

Run:

```bash
node -e "const fs=require('fs');const matter=require('./web/node_modules/gray-matter');const f='web/src/content/posts/frontend-engineering-practices.md';const p=matter(fs.readFileSync(f,'utf8'));for(const k of ['title','date','excerpt','tags'])if(!p.data[k])throw new Error('missing '+k);if((p.content.match(/```/g)||[]).length%2)throw new Error('unclosed fence');console.log(p.data.title)"
```

Expected: prints `前端工程化实践：从项目约定到 CI/CD`.

- [ ] **Step 5: Commit the article**

```bash
git add web/src/content/posts/frontend-engineering-practices.md
git commit -m "docs: add frontend engineering practices"
```

### Task 6: Batch Validation And Editorial Review

**Files:**
- Verify: all five new Markdown files

- [ ] **Step 1: Verify all required files exist and no unexpected migration files were added**

Run:

```bash
git show --name-only --format= HEAD~5..HEAD
```

Expected: the five planned article files plus no unrelated content or `README.md`.

- [ ] **Step 2: Parse every post through the production metadata dependency**

Run:

```bash
node -e "const fs=require('fs'),path=require('path'),matter=require('./web/node_modules/gray-matter');const d='web/src/content/posts';for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.md'))){const p=matter(fs.readFileSync(path.join(d,f),'utf8'));for(const k of ['title','date','excerpt','tags'])if(!p.data[k])throw new Error(f+': missing '+k);if(!Array.isArray(p.data.tags))throw new Error(f+': tags must be array')}console.log('all posts valid')"
```

Expected: `all posts valid`.

- [ ] **Step 3: Run the batch privacy scan**

Run:

```bash
rg -n -i 'app\.notion\.com|notion\.so|prod-files-secure|x-amz-|gffunds|kanban|claude\.ai|appsecret|clientsecret|privatekey|password\s*[:=]|token\s*[:=]|https?://[^ )]*\.(local|internal)' web/src/content/posts/frontend-code-review-guide.md web/src/content/posts/websocket-vue-reconnection-guide.md web/src/content/posts/indexeddb-practical-guide.md web/src/content/posts/chrome-devtools-debugging-tips.md web/src/content/posts/frontend-engineering-practices.md
```

Expected: no output and exit code 1.

- [ ] **Step 4: Check public links and editorial residue**

Run:

```bash
rg -n -i 'todo|tbd|fixme|待补充|待确认|回去试|好像|可能之后|lorem|example\.com' web/src/content/posts/frontend-code-review-guide.md web/src/content/posts/websocket-vue-reconnection-guide.md web/src/content/posts/indexeddb-practical-guide.md web/src/content/posts/chrome-devtools-debugging-tips.md web/src/content/posts/frontend-engineering-practices.md
```

Expected: no output and exit code 1.

Manually open every remaining external link and confirm it is public, relevant, and primarily an official documentation source.

- [ ] **Step 5: Build the production site**

Run:

```bash
npm run build
```

Run from: `web/`

Expected: Next.js build succeeds and static generation includes the five new `/blog/<slug>` routes.

- [ ] **Step 6: Review the rendered articles locally**

Run:

```bash
npm run dev
```

Run from: `web/`

Expected: the development server starts on an available local port. Review `/blog` and each new route at desktop and narrow mobile widths; confirm headings, tables, long code lines, links, and tag wrapping are readable without overlap.

- [ ] **Step 7: Record any final editorial corrections in one commit**

If review required changes:

```bash
git add web/src/content/posts/frontend-code-review-guide.md web/src/content/posts/websocket-vue-reconnection-guide.md web/src/content/posts/indexeddb-practical-guide.md web/src/content/posts/chrome-devtools-debugging-tips.md web/src/content/posts/frontend-engineering-practices.md
git commit -m "docs: polish first Notion migration batch"
```

If review required no changes, do not create an empty commit.
