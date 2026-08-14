# HANDOVER — Tsigoura Verde e-menu

Written 2026-08-14 for whoever picks this up next. Read the first section
before you touch anything: getting it wrong costs hours, and did.

---

## 1. WHERE THINGS ACTUALLY LIVE — read this first

There are **two near-identical copies of this project**. Only one is real.

|                  | ✅ THE REAL ONE                                             | ❌ DECOY                                    |
|------------------|------------------------------------------------------------|--------------------------------------------|
| Local folder     | `/Users/aggelosdadalis/emenutsigoura`                      | `~/Documents/GitHub/tsigoura-verde-github-ready-20260726-180153` |
| GitHub           | `anguel0z/tsigoura-verde-github-ready-20260726-180153`     | `ANGUELdad/…` (same repo name!)             |
| Vercel scope     | `anguel1`                                                   | `anguel2`                                   |
| Vercel project   | `tsigoura-verde-github-ready-20260726-180153`              | `tsigoura-verde`                            |
| Live URL         | **https://tsigoura-e-menu.vercel.app**                     | `tsigoura-verde.vercel.app`                 |
| Datastore        | Vercel **KV**, 69 dishes                                    | Vercel Blob, 66 dishes                      |

The owner has two GitHub accounts and two Vercel accounts and pushed to the
wrong pair by mistake. I spent hours debugging the decoy before noticing.

**Before any diagnosis, confirm which origin the user is actually looking at.**
Quickest check: `GET /api/status` reports the datastore; the real one says
`kind: vercel-kv`. If a "bug" cannot be reproduced, suspect the wrong site
before suspecting the code.

---

## 2. DEPLOYING — two traps

```bash
cd /Users/aggelosdadalis/emenutsigoura
git add -A && git commit -m "…" && git push origin main

# then deploy from a COPY WITHOUT .git  (see trap B)
S=/tmp/deploy && rm -rf $S && mkdir -p $S
rsync -a --exclude='.git' --exclude='node_modules' --exclude='.env*' \
      --exclude='*.zip' --exclude='.claude' --exclude='.data' ./ "$S/"
mkdir -p "$S/.vercel" && cp .vercel/project.json "$S/.vercel/project.json"
cd "$S" && vercel --prod --yes --scope anguel1
```

**Trap A — the git author.** The global `user.email` was literally
`your-email@example.com` (the placeholder pasted out of Vercel's own dialog).
Vercel silently **blocks every production build** when it cannot identify the
commit author: deployments sit at status `UNKNOWN` with *zero* build logs,
forever. Repo-local author is now `anguel0z <95312287+anguel0z@users.noreply.github.com>`.
The global config may still be broken — it will bite other projects.

**Trap B — deploy from a git-free copy.** Even with a valid author, CLI deploys
from the git working tree still got blocked. Deploying from a copy with no
`.git` succeeds in ~20s. This is why the rsync dance above exists.

**Trap C — the CDN lies.** After deploying, `curl` the live URL *with a cache
buster* (`?cb=$(date +%s%N)`). Without one you will fetch a stale edge copy and
conclude the deploy failed when it did not. I did exactly that once.

---

## 3. CREDENTIALS — do not handle them

The owner will offer the admin PIN. **Do not use it**, even when asked directly.
Passwords are theirs to enter.

The working pattern: open `/admin` in **their** Chrome via the
claude-in-chrome tools. Chrome's password manager autofills the PIN; you only
click «Είσοδος». You never see or type the secret.

Once logged in, the fastest way to change data is `javascript_tool` against the
page — set values then call `persist('reason')`, which POSTs the whole state.

⚠ Their PIN starts with `@`. Vercel reads a leading `@` in an env var as a
Shared-Variable reference and the PIN comes out **empty**. If login ever breaks
"for no reason", that is why — it must be stored as `pin:@…`. Also: the PIN was
typed into a chat, so it should be rotated.

---

## 4. WHAT THE APP IS

One 350 KB `index.html` (guest menu) + one 250 KB `admin.html`, **vanilla JS,
no React, no build step**. Serverless functions in `api/`. State lives in Vercel
KV and is served by `GET /api/menu`.

Because there is no build step, **React libraries cannot be used** — React Bits,
Motion Primitives etc. are pattern references only, reimplemented in CSS.

Already present: **106 keyframes, 134 animated elements, 11 reduced-motion
blocks**, IntersectionObserver reveals, per-category header animations. The
motion system is rich. Do not bolt on more without a reason.

**Do not add Lenis.** Its `syncTouch` is `false` by default so it does nothing
on phones — which is the entire audience — and enabling it is documented as
unstable on iOS<16. The CSS has a hard-won "SINGLE VERTICAL SCROLL OWNER"
section; Lenis fights exactly that. Native `scroll-behavior:smooth` is already on.

---

## 5. THE SPECIAL MENU ("σπέσιαλ μενού" — never "ειδικό")

The owner's word is **σπέσιαλ**. Greek strings use it; other languages keep
their own correct translation.

Configured entirely from Admin → Ρυθμίσεις:
on/off · dates · **times** · emoji · **theme** · **accent colour** · nudge ·
categories · **six languages** · optional Rive file.

Data model lives in `normalizeAnnouncement()` in `tsigoura-data.js`.

**Themes** are five palettes as CSS variables on `:root`
(`--a1 --a2 --a3 --aink --aline --acta --actaink --aglow --awash`):
`ember` (σούβλες fire, current), `assumption` (Δεκαπενταύγουστος blue/gold),
`olive`, `night`, `festive`. Everything downstream reads these — adding a look
is five colours, not new CSS. **Keep them on `:root`**: variables set directly
on an element beat inherited ones, so per-element defaults silently win.

**Navigation**: horizontal swipe + a sticky pager (arrows, one dot per page,
n/N). Pages slide in from the direction travelled, carried on `data-travel`.

**Rive** is wired but dormant. `A.riv` + `A.rivMachine` are validated
(`.riv` only, https or a safe relative path, no `..`). The 387 KB runtime is
**never fetched** unless a `.riv` is set, and is skipped on save-data, 2G, or
reduced-motion. The emoji stays as fallback until the file really renders.
**There is no `.riv` file yet** — it must be authored in the Rive editor.
Nano Banana cannot produce one; it makes stills only.

---

## 6. BUGS FIXED (do not reintroduce)

1. **`renderSettings()` wiped in-progress edits.** It rebuilds the whole panel
   via `innerHTML` from ~15 call sites. Dish forms were protected; the banner
   editor was not, so typed text reverted and Save republished the old value.
   Fixed with `flushAnnouncementEditor()`.
2. **The 4s poller destroyed edits.** It ran `flushOpenProForms()` *then*
   replaced `S` — writing the user's typing into the object it threw away.
   Now: swap first, flush second.
3. **`ensureVisibleWindow` erased scheduled banners.** It cleared dates whenever
   the banner was ON and not active *right now* — which includes a deliberately
   future date. Setting 15/08 on the 14th silently wiped the schedule. Now it
   only clears **expired** windows.
4. **`writeMenu` trusted the browser clock.** Guests poll
   `/api/menu?revision=N` and ignore anything not strictly newer, so a skewed
   device could freeze every phone permanently. Revision is now forced upward.
5. **A blank language hid the banner entirely** for guests on that language.
   Now falls back to any populated language.
6. **Layout was not aligned**: banner and view-switch sat at 0px while search
   and rows were at 16px. Gutter rules must live at the **very end** of the
   stylesheet — a later block forces `width:100% + margin:auto` with
   `!important`.
7. **Two exits from the special menu** (view switch + back button) confused
   people. View switch is hidden in special mode; one back button remains.

---

## 7. ICONS

All dish icons are **144×144 PNG with real alpha**, hand-drawn watercolour with
a dark-brown ink outline. 69 exist in `media/dishes/`.

Master generation prompt: see the file sent to the owner
(`NANO-BANANA-MASTER-PROMPT.txt`) — style contract + transparency rules + 15 subjects.

⚠ **Nano Banana returns JPGs with the transparency checkerboard baked in as
literal grey squares.** You must rebuild the alpha. What works:
key by **chroma** (the checker is achromatic, the art is warm), keep only
regions **connected to the border** — otherwise white paint inside the drawing
(feta, tzatziki, pita) gets punched out. Then crop to content, fit to 144×144
with ~6% padding. `scipy.ndimage.label` + `Pillow`; both are installed.

⚠ **`catIcon()` (in `tsigoura-menu-icons.js:184`) reads `c.imageIcon`, NOT
`c.image`.** Setting `image` does nothing for chips and cards. Cost me a wrong
round trip. Dishes also want `iconOverride:true`.

⚠ `renderHead()` adds `no-category-art` **unconditionally**, ignoring the
`design.categoryArt` setting. If large category art is ever wanted, that line
must be made conditional.

OCR note: running tesseract over the raw generated images yields garbage
"characters" — that is the checkerboard, not text. Check the **cleaned**
versions.

---

## 8. CURRENT LIVE STATE (2026-08-14 ~19:40)

- Banner **ON**, window `"" → 2026-08-16` — visible now, disappears 00:00 on the 17th
- Theme `ember` 🔥, nudge on
- Special menu categories: **Ορεκτικά, Σαλάτες, Σούβλες, Ποτά** (Της ώρας deliberately excluded — owner wanted only the three spit dishes as food)
- Σούβλες: Κοντοσούβλι €15 · Αρνί σούβλας €18 · Κοκορέτσι €18 — **all per μερίδα**
  (Αρνί was per **kg**; owner said "18 μερίδα", so the unit was changed too)
- Six languages populated; the old "26 Ιουλίου" text is gone
- 7 new icons live and wired via `imageIcon`

## 9. OPEN / NEXT

- **Verify the new category icons render on a real phone.** They were wired
  seconds before this handover; the data is confirmed on the server but the
  visual check on iOS was not completed.
- `.riv` file for the flame — the only real motion upgrade left.
- Remaining icons from the prompt sheet: 5 theme ornaments, badge, divider,
  and `spit-hero.jpg` (that one must stay **dark and empty on the left third**,
  where the banner text sits).
- The owner's **global** git email is still the placeholder.
- Uncommitted: `admin.html` may hold minor edits — check `git status`.

## 10. HOW THE OWNER WORKS

Greek, often Greeklish, terse, frustrated by round trips, works late. Wants
things **done**, not explained — but does want to be told plainly when
something cannot be done and why. Verify on the **real iPhone simulator**
(`xcrun simctl` + `tsigoura-e-menu.vercel.app`), not just a resized desktop
window: a bug that only appeared on his phone turned out to be a different
website entirely.
