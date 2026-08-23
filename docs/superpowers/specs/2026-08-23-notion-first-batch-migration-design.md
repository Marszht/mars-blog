# Notion First-Batch Article Migration Design

## Goal

Turn five technical notes from the private Notion `Docs` workspace into polished, self-contained public articles for `marsmz.top`, while excluding private material and removing details that can identify an employer, project, team, account, or personal situation.

## Scope

The first batch contains exactly five articles:

| Source note | Public article | Slug |
| --- | --- | --- |
| Frontend Code Review guide | Frontend Code Review: from local checks to review collaboration | `frontend-code-review-guide` |
| WebSocket tutorial | Reliable WebSocket connections in Vue 3 | `websocket-vue-reconnection-guide` |
| IndexedDB introduction | Practical IndexedDB: transactions, indexes, and a reusable wrapper | `indexeddb-practical-guide` |
| Chrome debugging tips | Practical Chrome DevTools debugging techniques | `chrome-devtools-debugging-tips` |
| Frontend engineering | Frontend engineering: a progressive path from conventions to CI/CD | `frontend-engineering-practices` |

The work creates five Markdown files under `web/src/content/posts/`. It does not change the Notion sources, the website information architecture, or the Markdown renderer.

## Editorial Approach

Use editorial reconstruction rather than a literal export. Preserve useful experience and the author's practical voice, but reorganize every article around a clear reader problem, verify technical claims, replace incomplete examples, and remove note-taking residue such as empty sections, uncertain reminders, duplicated lists, and private links.

Each article must:

- open with the problem it helps solve;
- provide a concise mental model before implementation details;
- use self-contained examples that do not depend on private types or repositories;
- distinguish hard requirements from team-specific recommendations;
- include practical failure modes and a short closing checklist or summary;
- use the existing frontmatter fields: `title`, `date`, `excerpt`, and `tags`;
- use an ASCII, kebab-case filename.

The publication date for all five articles is the migration date, `2026-08-23`. The prose can state when a recommendation depends on current browser or tool behavior, but the articles must not claim that the migration date is the date of the original research.

## Article Treatments

### Frontend Code Review

Keep the four-stage workflow, review checklist, comment severity model, and rollout advice. Generalize Vue-specific material where possible, while retaining a focused Vue 3 and TypeScript section where it adds value.

Remove the internal task-board URL, employer and product vocabulary, financial calculations, identity verification flows, mobile-container field names, and any example that could reveal a private architecture. Replace them with generic examples involving carts, user profiles, notifications, and API adapters.

Rules such as a 400-line diff or an 80-line function are heuristics, not universal gates. Present them as adjustable team signals and explain why smaller changes are easier to review.

### WebSocket

Retain the protocol overview and Vue composable direction. Rewrite the implementation so it handles repeated `connect()` calls, manual shutdown, reconnect timers, queued messages, listener cleanup, and component unmounting without reconnecting after intentional closure.

Use a generic message type. Explain that reconnection policy, authentication renewal, heartbeat behavior, and message delivery guarantees are application decisions rather than features supplied automatically by the browser API.

### IndexedDB

Correct the product name to `IndexedDB` throughout. Explain databases, object stores, keys, indexes, versions, requests, and transactions with one consistent example.

Replace the private `ChatMessage` import and project path with a local `StoredMessage` interface. Provide self-contained open, add-or-update, list, and clear operations. Avoid fixed storage quota claims because quotas vary by browser, device, origin engagement, and available disk space.

### Chrome DevTools

Rebuild the note around common debugging workflows: inspect and edit DOM/CSS, search sources, use breakpoints, investigate network requests, work with console helpers, simulate devices and network conditions, and capture screenshots.

Separate macOS shortcuts from Windows/Linux shortcuts when they differ. Remove unverified reminders, obsolete wording, the `--disable-web-security` launch command, and `$i`, which is supplied by an extension rather than DevTools itself. Do not recommend weakening browser security.

### Frontend Engineering

Expand the outline into a progressive engineering path: project foundations, dependency and package management, static checks, tests, build reproducibility, CI, deployment, observability, and feedback loops.

Remove references to the current employer's missing capabilities and avoid presenting one framework or toolchain as universally correct. Use a small maturity ladder so individual developers and small teams can adopt practices incrementally.

## Privacy And Safety Rules

No public article may contain:

- employer, client, internal product, repository, domain, board, or task identifiers;
- credentials, tokens, account details, environment data, IP addresses, or private URLs;
- resume history, colleague details, team staffing details, or identifiable incidents;
- financial holdings, account-opening details, personal budgets, home information, or family plans;
- screenshots copied from private systems or expiring Notion file URLs;
- a claim of firsthand production use when the source only records an idea or generated suggestion.

Generic technology names and links to public primary documentation are allowed. Before completion, scan the new files for source-specific names, private domains, Notion URLs, signed asset URLs, email addresses, IP-like strings, and credential-shaped terms.

## Source And Asset Handling

Notion remains the private source of record. The migration is one-way for this batch: website edits do not update or archive the original pages.

Do not embed Notion source URLs in the public articles. Do not reuse expiring S3 URLs. Prefer text, code, and simple Markdown tables. If an illustration becomes essential during editing, create a local asset under `web/public/images/blog/` and reference it with a stable `/images/blog/...` path; the default design requires no new image assets.

## Verification

Verification is complete when:

1. All five Markdown files parse through the existing `gray-matter` loader and contain valid required frontmatter.
2. Each article has a unique slug and appears in `getAllPosts()`.
3. The privacy scan finds no internal or personal identifiers, Notion URLs, or signed image URLs.
4. Public links use primary documentation where a technical claim depends on platform behavior.
5. `npm run build` succeeds from `web/`, including static generation of all five article routes.
6. A final editorial review finds no placeholders, note-to-self language, broken code fences, or claims that exceed the evidence in the source notes.

## Non-Goals

- Migrating any other page in `Docs`.
- Publishing investment, interview, resume, home, account, or personal planning content.
- Building automatic Notion synchronization.
- Adding categories, search, a CMS, a new renderer, or new blog UI.
- Modifying or deleting Notion pages after migration.

