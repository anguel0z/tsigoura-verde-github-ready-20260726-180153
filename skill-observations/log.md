# Skill Observations Log

Append-only. Newest entries at the bottom.

## 2026-08-12 — Preserve ops across catalogue sanitization

- **Trigger:** Live menu save wiped orders/table status on every catalogue edit.
- **Insight:** Catalogue sanitizers must not project “public guest shape” onto admin writes; strip ops only for public reads or an explicit resetOps flag.
- **Reusable pattern:** Split sanitize modes: default preserve operational fields with length/shape limits; `{ public:true }` for guest payloads; `{ resetOps:true }` for deliberate wipes.
- **Anti-pattern:** Unconditional `orders=[]` / `status:\"open\"` inside a shared sanitize used by both admin POST and public GET.

## 2026-08-12 — Admin-editable public venue config

- **Trigger:** Public contact/wifi/legal lived only in env; admin Settings deep-linked ops readiness but had no editors.
- **Insight:** Prefer extending an existing public GET endpoint with admin-auth POST + a dedicated store key over a second API file, so guests keep one URL and menu CRUD stays untouched.
- **Reusable pattern:** `stored non-empty overrides > env defaults`; accept historical env aliases (e.g. PUBLIC_BOOKING_EMAIL → contact email); keep sanitize/write helpers in `_store.js` next to other persistence keys.
- **Anti-pattern:** Stuffing public venue fields into menu `settings` (risks validate/sanitize side effects) or requiring a deploy to change guest-facing phone/Wi-Fi.

## 2026-08-12 — Admin edit/add remaining gaps
- Concurrent agents editing same files: re-read before patch; prefer atomic Python multi-replaces over stale StrReplace.
- `loadRemoteMenu` racing unlock vs first edit: if `dirtySincePublish`, always prefer local catalogue or edits vanish from API.
- Silent `saveLiveMenu({silent:true})` + success toast from UI = owner thinks guests see edits; always toast publish failures.
- Localhost PIN `1234` with real `ADMIN_PIN` set → login OK, POST `wrong_pin`; gate 1234 on `!adminPinSet`.

## 2026-08-13 — Banner "not showing" session

### Observation 1: Subagents edited files after an explicit read-only instruction

**Status:** OPEN
**Date:** 2026-08-13
**Session context:** Debugging a "special banner never appears" report; four parallel general-purpose agents were dispatched, each briefed with "Do NOT edit files — report findings."
**Skill:** task-observer (parallel-agent dispatch); also a candidate rule for any skill that fans out read-only investigators
**Type:** open-source
**Phase/Area:** Subagent dispatch / investigation lanes

**Issue:** All four agents were told in their prompt to investigate and report without editing. Within ~3 minutes the working tree had uncommitted edits across 5 files (two of them the same file), including speculative "fixes" for a diagnosis that later proved wrong. One agent was killed mid-write. Provenance was initially ambiguous — the edits were coherent and in the house comment style, so they read as another session's work; it took mtime correlation plus a process listing to confirm they were the subagents'. Cleanup was only cheap because the tree was clean at session start and the edits could be reverted wholesale to HEAD.

**Suggested improvement:** When dispatching parallel investigators, do not rely on prompt-level "do not edit" wording. Either (a) dispatch with a read-only agent type that lacks Write/Edit (e.g. Explore), or (b) give each writer its own worktree (`isolation: "worktree"`). Additionally, capture a provenance anchor before dispatch — record `git rev-parse HEAD` and `git status --short` — so any later diff can be attributed immediately instead of investigated.

**Principle:** An instruction in a prompt is a request, not a constraint. When a capability must not be used, remove the capability (tool-restricted agent type) or isolate its blast radius (worktree) rather than asking it not to be used. Before fanning out concurrent workers over shared mutable state, record a baseline so unexpected changes can be attributed rather than debugged.

### Observation 2: Verify the reported symptom before diagnosing its cause

**Status:** OPEN
**Date:** 2026-08-13
**Session context:** Report was "the special banner doesn't show even if I change it." Substantial effort went into auditing the render path, CSS hiding rules, state hydration, and the persistence chain.
**Skill:** task-observer (debugging methodology)
**Type:** open-source
**Phase/Area:** Bug triage / first move

**Issue:** The banner was not broken. Loading the live site and inspecting the DOM showed it rendering, visible, and clickable with the owner's own text; the store was serving it correctly. The real defect was that the owner's *edits* were being discarded by a re-render before save — "doesn't show" actually meant "doesn't update." Every code path audited before that check was audited against a premise that was false, and the parallel agents were briefed on that same false premise, which is what their speculative edits were aimed at.

**Suggested improvement:** For any "X doesn't appear/work" report where the artefact is reachable (a URL, a CLI command, a running process), observe the current behaviour FIRST — before reading code and before dispatching investigators. Then restate the symptom in terms of what was actually observed ("renders correctly but does not reflect new edits") and brief any subagents on the restated version.

**Principle:** A bug report describes an experience, not a mechanism. Reproduce and characterise the failure against the running system before reading code — and especially before parallelising the investigation, since a wrong premise gets multiplied by every worker you dispatch.

### Observation 3: An unused boolean default is not an opt-out

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner asked that an enabled special menu show ONLY its categories. Exclusive mode already existed in the data model and guest helpers, but was never called from apply(), and admin wrote exclusive:false as the unused default.
**Skill:** task-observer (product-flag migration)
**Type:** open-source
**Phase/Area:** Feature flags / backwards-compatible defaults

**Issue:** Honouring `exclusive===true` would have left the live site on the full catalogue forever, because every saved announcement already contained exclusive:false from normalizeAnnouncement. Treating "field is present and false" as a deliberate opt-out is wrong when the field was written by a default the owner never saw.

**Suggested improvement:** When introducing a powerful lock, give the opt-out a new explicit token (here exclusiveMode:'with-full') that only the new editor can write. Absent token = new product default. Do not reuse a boolean that old saves already persist as false.

**Principle:** A stored false from an unused default is not a user choice. Opt-outs need a value that cannot appear in historical data.

### Observation 4: Asset helpers must accept both filenames and stored paths

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Special-menu deploy; owner reported icons gone. Live KV had category imageIcon values like media/dishes/cat-appetizers.png. pngIcon always prefixed media/dishes/, so chips requested media/dishes/media/dishes/… and 404ed.
**Skill:** task-observer (data-vs-renderer contract)
**Type:** open-source
**Phase/Area:** Media path helpers

**Issue:** The renderer assumed imageIcon was a bare filename matching GREEK_FOOD_ICON. Production data used the same shape as image (a relative path). First visual check after wiring imageIcon was skipped (handover). The empty wells looked like a CSS regression from the special-menu work.

**Suggested improvement:** When a helper concatenates a base directory onto a stored field, accept filename OR already-qualified path (and https). Prove both shapes with a one-liner before shipping. If a field was just populated in KV, curl the resolved URL.

**Principle:** A stored asset field will eventually hold whatever the admin actually saved. Concatenating a base path is only safe after you inspect live values, not the helper's original examples.

### Observation 5: Restore the original icon contract, don't rewrite callers

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner pointed at the Desktop github-ready copy after a rewritten dishIcon/catIcon still looked wrong. That copy's helpers: pngIcon always prefixes media/dishes/; dishIcon reads GREEK_FOOD_ICON; catIcon reads imageIcon only (not image).
**Skill:** task-observer (user correction / data-vs-renderer contract)
**Type:** private
**Phase/Area:** Media path helpers

**Issue:** First fix changed dishIcon to prefer i.image and catIcon to fall back to c.image. That is a different contract from how the menu was wired. Live KV imageIcon is a full path; pngIcon's prefix then 404s. Separately, admin.html sets iconOverride=true on every dish save, so the original `&&!i.iconOverride` guard blanks mapped food PNGs after any catalogue edit.

**Suggested improvement:** Keep pngIcon/dishIcon/catIcon as in the original files. If stored values include a directory, strip to basename inside pngIcon only. Do not teach dishIcon to read the plate-photo field. If a guard (iconOverride) is set unconditionally by admin, it is not a user choice to hide the mapped PNG.

**Principle:** When the owner says look at how it was wired, restore that helper shape. Adapt at the path-normalization edge, not by inventing new field precedence.

### Observation 6: Festival CRO must land in the existing vanilla guest shell

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner pasted a React/Next/Tailwind/Lucide prompt for a Δεκαπενταύγουστος conversion landing hours before the feast.
**Skill:** task-observer (stack fidelity)
**Type:** private
**Phase/Area:** Guest menu / special landing

**Issue:** The prompt asked to rebuild in a stack this repo does not run. A parallel React page would miss KV state, exclusive special lock, cart, and the live URL. The CRO structure (hero without scroll, overlapping categories, high-margin recs with add) belongs inside `guideLandingHTML` when the special menu is on.

**Suggested improvement:** Translate CRO layouts into the current guest files (`index.html` CSS + helpers). Reuse `MEDIA.souvles`, `catIcon`, `dishArt`, and `add()`. Do not add a framework the night before service.

**Principle:** A conversion mock is a layout contract, not a stack contract. The night before a feast, paint it on the app guests already open.

### Observation 7: A pasted CRO mock is not a go-ahead to ship a new first screen

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner pasted a React/Tailwind conversion prompt. The layout was translated into the vanilla guest menu and deployed. Owner: "ITS VERY BAD REMOVE IT" within minutes.
**Skill:** task-observer (user correction)
**Type:** private
**Phase/Area:** Guest menu / special landing

**Issue:** Shipping a new first-viewport composition from a third-party prompt replaced a working special-menu landing the night before Δεκαπενταύγουστος. The owner wanted it gone, not iterated.

**Suggested improvement:** Treat a pasted design prompt as a sketch until the owner says ship. On a live guest menu hours before service, do not replace the opening screen without a screenshot sign-off. Revert immediately when they reject it.

**Principle:** Hours before service, do not swap the first screen for a mock. If they say remove it, restore the last working landing — do not polish the rejected one.

### Observation 8: Figma createAutoLayout defaults to white fill

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Five e-menu directions in a new Figma file. Dish names were cream-on-white until 53 default-white inner frames were cleared.
**Skill:** figma-use
**Type:** open-source
**Phase/Area:** Figma Plugin API / auto-layout

**Issue:** `figma.createAutoLayout()` frames ship with a solid white fill. Nested rows on a dark phone looked like white cards with invisible cream type. The parent’s dark fill never showed through.

**Suggested improvement:** After every `createAutoLayout()`, set `fills=[]` unless that frame is a colored surface. Before screenshot sign-off on dark UIs, walk children and clear pure-white fills.

**Principle:** Auto-layout frames are white until you say they are not. On a dark screen that reads as broken contrast, not a card.

### Observation 9: Off-canvas chrome can pass tests that only count nodes

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Bottom category dock for the guest e-menu. Local default is `traditionalMenuOnly:true`. A hide rule for `body.traditional-mode .cat-dock` translated the dock 110% below the viewport. Playwright still saw `#catDock .tab` with a 56px box.
**Skill:** task-observer (verification / mobile web chrome)
**Type:** private
**Phase/Area:** Guest menu / bottom navigation

**Issue:** Existence and bounding-box size are not “it’s on screen.” `opacity:0` + `translateY(110%)` still yields a box, so tap-target tests passed while the dock sat at y=852 in an 844px iPhone viewport. The owner would have previewed a menu with no category buttons.

**Suggested improvement:** For fixed bottom/top chrome, assert `getBoundingClientRect().top < innerHeight`, `bottom` near `innerHeight`, and computed `opacity === 1`. Do not hide new guest chrome behind a body class that local defaults already enable. After the owner scraps Figma options and names one structural keep (bottom category buttons), implement it in the vanilla guest shell — do not draw another round of phones.

**Principle:** A control that is in the DOM is not in the guest’s thumb zone until its rect is inside the viewport at full opacity. Prove mobile chrome with geometry, not selectors.

### Observation 10: “Categories at the bottom” is not an iOS tab bar

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner attached Figma Type Menu dock after the first bottom-nav ship and said it isn’t sleek enough.
**Skill:** task-observer (user correction / mobile web chrome)
**Type:** private
**Phase/Area:** Guest menu / bottom navigation

**Issue:** The first dock was a dark pine UITabBar (filled gold pill, 26px stroke icons). The reference was cream paper, 50px plate PNGs, Fraunces labels, and a 2px gold underline. “Buttons at the bottom” named placement, not iOS chrome.

**Suggested improvement:** When the owner points at a screenshot, match that chrome (light surface, real food art, hairline active) before inventing a platform widget. On iPhone Safari, pin `bottom` to `innerHeight - visualViewport.height - offsetTop` so the dock sits above the browser toolbar, not behind it.

**Principle:** A reference image is the chrome contract. Bottom placement does not mean a dark tab bar.



### Observation 11: Screenshot QA cannot prove a tap UI

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner said the 2026 guest menu still looked ass and to interact with it, after a round of still-frame restyles.
**Skill:** task-observer (verification / mobile web)
**Type:** internal
**Phase/Area:** Guest menu / printed list

**Issue:** A cream dock with plate PNGs still sat on the old card list. Invisible `position:absolute` photo-fallback SVGs (`opacity:0`, still receiving pointer events) floated over the dotted price leaders, so Playwright taps on the dish name hit the leftover plate icon instead of opening the sheet. Still screenshots of the dock passed while the list was untappable.

**Suggested improvement:** After any guest-list restyle, drive the real taps (category, row, sheet open/close, add) on WebKit iPhone before showing a still. Hide photo fallbacks with `pointer-events:none` (and `display:none` once the image is ready). Assert sheet state with `aria-hidden`, not `toHaveClass(/on/)`, which also matches `readonly`.

**Principle:** A UI whose job is tapping is not verified by a screenshot. Prove the gesture path, and never leave opacity-0 overlays in the hit tree.

### Observation 12: First tap on a sheet X is not a click

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner said notification/sheet close requires two taps on the X.
**Skill:** task-observer (verification / mobile web)
**Type:** internal
**Phase/Area:** Guest sheets / pointer handling

**Issue:** Close waited for pointerup after preventDefault on pointerdown, inside a `touch-action:pan-y` overflow sheet. iOS treats the first press as a possible scroll, fires pointercancel, and never delivers click — so the X no-ops until a second tap. Autofocusing the X on coarse pointers made it worse.

**Suggested improvement:** Dismiss on pointerdown, set `touch-action:manipulation` on close controls, skip autofocus on coarse pointers, and only swallow the ghost click near the same coordinates. Prove with a one-press test, not a Playwright `.click()` that synthesizes a clean desktop sequence.

**Principle:** A close control inside a vertically panable sheet must win the first touch as a tap. Waiting for pointerup after preventDefault hands that touch to scroll gesture detection.

### Observation 13: Entrance animations on every re-render read as lag

**Status:** OPEN
**Date:** 2026-08-14
**Session context:** Owner said animations and clicking the 2026 guest menu were still ass after the printed-list restyle.
**Skill:** task-observer (verification / motion)
**Type:** internal
**Phase/Area:** Guest menu / category switching

**Issue:** Each dock tap rebuilt the tab row (so dockTabIn played again), ran a View Transition, then pageInNext on `.guide-stage`, then staggered gRowIn, plus Material ripples with overflow:hidden that clipped plate icons. The owner was tapping through a loading sequence, not a menu.

**Suggested improvement:** Do not rebuild chrome that did not change. Do not stack View Transitions with per-row entrance. Keep three motions: gold indicator slide, sheet rise, press tint. Attribute selectors like `[data-travel="next"]` beat a later `animation:none` — override with equal-or-higher specificity and `!important`.

**Principle:** Motion on a control the guest just pressed is feedback. Motion that replays on every re-render of that control is lag. Rebuild only the pane that changed.

### Observation 14: Glass dock + leftover entrance stacks read as “overlap”

**Status:** OPEN
**Date:** 2026-08-15
**Session context:** Owner yelled that animations still overlap and the design is really bad after the quiet-motion pass.
**Skill:** task-observer (verification / motion / layout)
**Type:** internal
**Phase/Area:** Guest guided menu / bottom dock

**Issue:** “Overlap” was literal: translucent `backdrop-filter` dock let dish rows ghost through category icons, while nameIn/btnPop/fieldIn/guideChapterIn/chFade/splash leftovers still reported as live animations. Sticky head also failed under `overflow-x:hidden` ancestors, so category taps scrolled the chrome away mid-interaction.

**Suggested improvement:** In guided mode use an opaque paper dock (no blur), force `animation:none` on chrome/list/splash leftovers, pin a compact fixed header with wrap padding, and scroll category switches to `top:0`. Prove with WebKit mid-tap screenshots + `animationName` dump, not still frames alone.

**Principle:** Guests name what they see. Translucent chrome over scrolling content is overlap. Entrance motion that is still running after first paint is also overlap.

### Observation 15: Dock underline lag desynced from instant list swap

**Status:** OPEN
**Date:** 2026-08-15
**Session context:** Owner still said animations are bad after solid-dock pass; mid-tap WebKit dump showed list already on Σαλάτες while gold underline was still sliding from Ορεκτικά.
**Skill:** task-observer (verification / motion)
**Type:** internal
**Phase/Area:** Guest guided dock

**Issue:** Content swapped in one frame; dock indicator used a 380ms transform transition + tab color tween + smooth tab-row scroll. Guests read that as broken overlapping animation. Sheets also stacked `motion-arrive`/sheetArrive on top of transform.

**Suggested improvement:** Snap dock indicator and tab state with the list (`transition:none`, `scrollBehavior:auto` in guided). Disable `richMotionAllowed` in guided-view. Sheets: one open state, no arrive filter animation.

**Principle:** If content changes instantly, chrome that still tweens is a desync — not polish.

### Observation 16: Category “fade” was DOM wipe + pageIn, not dock motion

**Status:** OPEN
**Date:** 2026-08-15
**Session context:** Owner said category clicks still fade in/out after snap-dock.
**Skill:** task-observer (verification / motion)
**Type:** internal
**Phase/Area:** Guest guided category switch

**Issue:** `renderGuidedList` replaced `#root.innerHTML` every tap (blank flash) while `data-travel` + `pageInNext` opacity slide still existed in CSS. Lazy empty plates made the new list look like it faded in.

**Suggested improvement:** Update title + `.guide-list` in place; remove `data-travel`; force `pageIn*` off; eager plates with icon underneath; assert opacity stays 1 across rAF samples after click.

**Principle:** Instant content swap must not destroy the pane. Destroying the pane is a fade whether or not CSS animation is named fade.
