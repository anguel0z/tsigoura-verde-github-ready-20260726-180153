# ICONS — Tsigoura Verde

Everything about the menu icons in one place: where they are, what exists,
what is still missing, and the exact prompts to generate the rest.

> The prompts were previously only in a temporary folder, which is why they
> could not be found. This file is committed to the repo — it will not vanish.

---

## 1. WHERE THEY ARE

```
/Users/aggelosdadalis/emenutsigoura/media/dishes/
```

**76 PNG files.** Live at `https://tsigoura-e-menu.vercel.app/media/dishes/<name>.png`

House format, do not deviate:

| | |
|---|---|
| Size | **144 × 144** |
| Format | **PNG-24 with real alpha** (transparent) |
| Style | hand-drawn, fine dark-brown ink outline, soft watercolour fill |
| Palette | terracotta `#B4623A`, olive `#38564F`, cream `#F5F0E3`, gold `#A07E3C` |
| Padding | ~6% even on all sides |

---

## 2. WHAT EXISTS — the 7 new ones (installed & live)

| File | Used for | Status |
|---|---|---|
| `70-kokoretsi.png` | Dish: Κοκορέτσι €18 | ✅ live, wired |
| `cat-appetizers.png` | Category: Ορεκτικά | ✅ live, wired |
| `cat-salads.png` | Category: Σαλάτες | ✅ live, wired |
| `cat-spit.png` | Category: Σούβλες | ✅ live, wired |
| `cat-meat.png` | Category: Της ώρας | ✅ live, wired |
| `cat-drinks.png` | Category: Ποτά | ✅ live, wired |
| `cat-pizza.png` | Category: Πίτσες | ✅ live, wired |

Plus the 68 original dish icons (`01-tzatziki.png` … `69-*.png`).

---

## 3. HOW AN ICON IS WIRED  ⚠ this cost a wrong round trip

`catIcon()` in **`tsigoura-menu-icons.js:184`** reads **`imageIcon`**, *not* `image`:

```js
function catIcon(c){
  return (c && c.imageIcon) ? pngIcon(c.imageIcon) : svgFor(…);
}
```

So to attach an icon you set **`imageIcon`**. Setting `image` alone does nothing
for the category chips and cards.

Done from the admin console while logged in:

```js
S.categories.find(c=>c.id==='spit').imageIcon = 'media/dishes/cat-spit.png';
// dishes also want iconOverride so the custom art wins over the auto icon
const d = S.menu.find(i=>/κοκορ/i.test(i.t.el.n));
d.imageIcon = 'media/dishes/70-kokoretsi.png';
d.iconOverride = true;
persist('icons');   // POSTs the whole state
```

⚠ `renderHead()` in `index.html` adds `no-category-art` **unconditionally**,
ignoring the `design.categoryArt` setting. Large category artwork is therefore
always off. If it is ever wanted, that line must become conditional.

---

## 4. ⚠ THE TRANSPARENCY TRAP — read before generating more

**Nano Banana returns `.jpg` files with the transparency checkerboard drawn in
as literal grey squares.** They *look* transparent in the preview. They are not.
Dropped straight into the menu, every icon carries a grey tiled box.

The alpha has to be rebuilt. What works (Pillow + numpy + scipy, all installed):

1. **Key by chroma, not by colour match** — the checkerboard is achromatic
   (grey/white or grey/black), the artwork is warm. Test `max(RGB) - min(RGB)`.
2. **Keep only regions connected to the border.** This is the important part:
   a plain colour match punches holes through white paint *inside* the drawing —
   the feta, the tzatziki, the pita, the glass. Flood from the edges instead.
   `scipy.ndimage.label`, then drop only components touching the frame.
3. Soften the cut (~0.7px blur on the alpha), crop to content, fit to 144×144
   with even padding.

The working script lives in the session scratchpad; the method above is enough
to rewrite it in a few minutes.

**OCR note:** running tesseract over the raw generated images returns garbage
"letters". That is the checkerboard, not text. Check the *cleaned* versions —
after keying, 4 of 7 came back completely clean and the rest showed only stray
marks from the cross-hatch shading. **No baked-in text in any of them.**

---

## 5. STILL MISSING — prompts ready to paste

Append this **style contract to every prompt below**, unchanged:

```
hand-drawn illustration, fine dark-brown ink outline (#3A2A1E, 2-3px at 144px,
never pure black), soft flat watercolour fill with slight pigment pooling near
the outline, light diagonal cross-hatch shading only where a shadow falls,
warm muted earthy palette — terracotta #B4623A, olive green #38564F,
cream #F5F0E3, gold #A07E3C, soft brown #7A5C22. ONE single centred subject,
slight 3/4 view as if looking down at a table, ~10% even padding, must stay
readable at 40x40 px.
NO text, no letters, no numbers, no watermark. No plate unless the item IS a
bowl or plate. No table, no ground plane, no cast shadow, no frame, no border,
no glow, no vignette.
OUTPUT: PNG-24 with a real ALPHA CHANNEL. Background 100% transparent — zero
pixels of colour, zero white, no paper texture. Transparent right up to the ink
outline. Anti-aliased edges fine; NO halo, fringe or white glow.
IF a true alpha channel is impossible, render instead on a FLAT PURE MAGENTA
background, hex exactly #FF00FF, perfectly uniform, no shading, no glow, no
magenta reflecting onto the subject — so it can be keyed out cleanly.
NEVER use white or grey as the fallback background.
```

Magenta matters: white eats the feta, the tzatziki and the cheese.

### Theme ornaments — 512 × 512, banner corner decoration

**`theme-assumption.png`** ← the Δεκαπενταύγουστος one
> Decorative corner ornament: a sprig of fresh basil, a small hanging votive oil lamp, and stylised Aegean waves beneath, with one eight-pointed gold star above.
> **PALETTE OVERRIDE: deep sea blue #0B2A4A, clean white, gold #D8B24C only.**

**`theme-ember.png`**
> Decorative corner ornament: a cluster of glowing embers with sparks rising, and two roasting skewers crossed behind them.
> **PALETTE OVERRIDE: dark red #40160A, burnt orange #8E3616, gold #C98B3E only.**

**`theme-olive.png`**
> Decorative corner ornament: an olive branch heavy with leaves and ripe olives, a small round clay oil jug at its base.
> **PALETTE OVERRIDE: deep green #1E3A2E, olive #B8C06A, cream only.**

**`theme-night.png`**
> Decorative corner ornament: a slim crescent moon, three small scattered stars, one sprig of rosemary.
> **PALETTE OVERRIDE: charcoal #14161A, antique gold #B99A5B only.**

**`theme-festive.png`**
> Decorative corner ornament: a laurel wreath with two small lanterns hanging from it and a few confetti specks drifting.
> **PALETTE OVERRIDE: deep wine #3A0F2A, plum #7B1E4B, gold #D9A24B only.**

### Extras

**`special-badge.png`** — 256 × 256
> A small circular seal, like a quality mark pressed into gold foil: a laurel border around the rim, one clean star at the centre. Completely empty inside apart from the star. NO TEXT.

**`special-divider.png`** — **1024 × 64 (wide, not square)**
> A slim horizontal ornamental rule: a thin line that swells at the centre into a small olive sprig motif, then tapers to fine points at both far ends. Symmetrical.

**`spit-hero.jpg`** — **1600 × 900, OPAQUE JPG, NOT the icon style**
> Painterly illustrated scene: a whole lamb roasting on a spit over glowing embers at dusk in a Greek taverna courtyard. Warm firelight from the lower right, deep shadow elsewhere, soft-focus background, gentle smoke. Painterly, not photoreal.
> **⚠ CRITICAL: the LEFT THIRD must stay DARK and EMPTY** — no subject, no bright area — the menu headline is overlaid there. Without this the title is unreadable over the fire.

---

## 6. AFTER GENERATING

1. Rebuild the alpha (section 4) — **never skip this**
2. Resize to 144×144 (512/1024 for the ornaments)
3. Drop into `media/dishes/`
4. `git add media/dishes/… && git commit && git push`
5. Deploy (see `HANDOVER.md` §2 — deploy from a **git-free copy**)
6. Verify each URL returns `200`
7. Wire with **`imageIcon`** (section 3), then `persist()`

Sanity check that a file really is transparent:

```bash
python3 -c "from PIL import Image; im=Image.open('media/dishes/X.png'); \
print(im.mode, im.size, 'corner alpha =', im.getchannel('A').getpixel((0,0)))"
# want: RGBA (144, 144) corner alpha = 0
```
