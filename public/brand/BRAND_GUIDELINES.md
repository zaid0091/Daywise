# Daywise — Brand & Logo Guidelines

**Concept:** *Mod-7 Grid* — Seven modular calendar units (6 rounded tiles + 1 circular Doomsday anchor node) arranged in a 2–3–2 grid forming a geometric **D**.

---

## 1. Master Files (`public/brand/`)

| File | Use |
|---|---|
| `daywise-symbol-color.svg` | Primary symbol on light backgrounds (`#111111` + `#059669`) |
| `daywise-symbol-dark.svg` | Primary symbol on dark backgrounds (`#FFFFFF` + `#34D399`, optically thinned) |
| `daywise-symbol-small.svg` | Small-size cut for 16–24 px icons and favicons (wider 22-unit gaps) |
| `daywise-wordmark-color.svg` | Standalone geometric `Daywise` wordmark (outlined paths, no font dependency) |
| `daywise-horizontal-color.svg` | Horizontal lockup for light surfaces |
| `daywise-horizontal-dark.svg` | Horizontal lockup for dark surfaces |
| `daywise-stacked-color.svg` | Stacked lockup for square/vertical placements |
| `variants/*` | One-colour (`black`, `white`, `mono-*`), `square`, `favicon`, and `app-icon` exports |

---

## 2. Colour Palette

| Role | Name | HEX | RGB | Use |
|---|---|---|---|---|
| Primary Ink (Dark UI) | Pure White | `#FFFFFF` | `255, 255, 255` | Tiles & `Day` on `#000000` / `#0A0A0A` |
| Primary Ink (Light UI) | Deep Ink | `#111111` | `17, 17, 17` | Tiles & `Day` on white/light surfaces |
| Brand Accent (Dark UI) | Emerald 400 | `#34D399` | `52, 211, 153` | Anchor dot & `wise` on dark backgrounds |
| Brand Accent (Light UI) | Emerald 600 | `#059669` | `5, 150, 105` | Anchor dot & `wise` on light backgrounds |
| Soft UI Highlight | Aloe | `#C1FBD4` | `193, 251, 212` | UI success states & ambient highlights |
| Canvas Night | Pure Black | `#000000` | `0, 0, 0` | Primary dark-mode background |

---

## 3. Clear Space & Minimum Size

- **Clear space:** Maintain a minimum clear space around the symbol equal to **1 tile width** (`56/256 ≈ 22%` of the symbol's height) on all sides.
- **Minimum sizes:**
  - **Symbol:** `16 × 16 px` (use `daywise-symbol-small.svg` or `variants/daywise-symbol-favicon.svg` below `24 px`).
  - **Horizontal lockup:** `120 px` wide minimum.
  - **Stacked lockup:** `96 px` wide minimum.

---

## 4. Approved Backgrounds & Misuse

- **Approved:** Pure black (`#000000`), elevated dark (`#0A0A0A`), pure white (`#FFFFFF`), and warm off-white (`#FBFBF5`). Use the `*-dark.svg` masters on dark surfaces and `*-color.svg` on light surfaces.
- **Do not:** Stretch or skew the mark, rotate individual tiles, add drop shadows/glows/gradients, place the light-mode `#111111` mark on dark backgrounds, or retype the wordmark in an unapproved font.

---

## 5. Production Notes

- All SVG files are **100% outlined vector paths/primitives** with zero `<text>` elements, zero embedded rasters, and zero filters.
- **Trademark note:** Automated logo design cannot guarantee trademark clearance; run a trademark and reverse-image search before commercial registration.

