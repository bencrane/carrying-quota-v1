# Carrying Quota — design system

Usage guide for the four-layer, platform-grade design-system foundation. For
the *why* behind these decisions, see `design-decisions.md`.

Carrying Quota is an editorial web application that embeds interactive data
figures inside long-form prose. The design system exists so that an arbitrary
data figure drops into any piece without the layout, type, spacing, or rhythm
system buckling.

---

## The four layers

```
Layer 0  @cq/tokens   token source of truth      (packages/tokens)
Layer 1  @cq/ui       token-typed UI primitives  (packages/ui)
Layer 2  app shell    pure chrome                (src/components/layout)
Layer 3  routes+pieces  content only             (src/routes, packages/ui/src/pieces)
```

The dependency direction is one-way: tokens ← primitives ← shell ←
routes/pieces. No layer reaches up.

---

## Layer 0 — `@cq/tokens`

One structured TypeScript token source. Eight categories:

| Category     | Export(s)                                    | Example |
|--------------|----------------------------------------------|---------|
| spacing      | `spacing`, `SpacingToken`                    | `spacing.lg` → `1.5rem` |
| type-scale   | `typeScale`, `lineHeight`, `tracking`, `fontWeight`, `fontFamily` | `typeScale["3xl"]` |
| color        | `color`, `colorThemeName`, `ColorToken`      | `color.accent.hsl` → `72 100% 61%` |
| radius       | `radius`, `RadiusToken`                      | `radius.none` → `0` |
| shadow       | `shadow`, `ShadowToken`                      | `shadow.glow` |
| motion       | `motion` (`duration` + `easing`), `easingCss`| `motion.easing.editorial` |
| breakpoint   | `breakpoint`, `BreakpointToken`              | `breakpoint.md` → `768px` |
| z-index      | `zIndex`, `ZIndexToken`                      | `zIndex.sticky` → `50` |

### The token build

```sh
npm run build:tokens
```

emits three artifacts from the one source:

- `packages/tokens/dist/tokens.css` — CSS custom properties (`--cq-*`)
- `packages/tokens/dist/theme.css` — a Tailwind v4 `@theme` block
- `packages/tokens/dist/index.{js,d.ts}` — the compiled typed exports

The build is idempotent — run it twice, get byte-identical output.

### Palette

Color values are reverse-derived byte-for-byte from `src/styles/globals.css`'s
locked `:root` palette. **Do not edit a color triplet** without editing
`globals.css` in lockstep — and `globals.css` is byte-locked. The live app
uses the hand-written `@theme inline` block in `globals.css`; the generated
`theme.css` is an additive artifact.

---

## Layer 1 — `@cq/ui` primitives

Import primitives from `@cq/ui`:

```tsx
import { Page, Section, Stack, Heading, Text } from "@cq/ui";
```

### The two hard rules

1. **Token-typed props.** Geometry/scale props take token values, not raw
   strings. `<Stack gap="lg">` compiles; `<Stack gap="huge">` does not.
2. **No `className`.** No primitive has a `className` prop. The only
   caller-facing class-injection point is `unsafe_className` — and the
   `no-geometry` ESLint rule exempts it. Reach for a token-typed prop first;
   `unsafe_className` is the conscious, visible exception.

### The inventory

**Layout** — `Box`, `Stack`, `Cluster`, `Grid`, `Container`, `Section`

| Primitive  | Owns | Key props |
|------------|------|-----------|
| `Box`      | a single styled element | `surface`, `pad`, `padX`, `padY`, `radius`, `border` |
| `Stack`    | vertical flow | `gap`, `align`, `as` |
| `Cluster`  | horizontal flow (wraps) | `gap`, `justify`, `align`, `wrap` |
| `Grid`     | responsive content grid | `cols`, `gap`, `align` |
| `Container`| content measure + horizontal padding | `width`, `bleed` |
| `Section`  | a page band (renders `<section>`) | `surface`, `gutter`, `divide`, `container` |

**Page** — `Page`, `PageHeader`, `PageSection`

| Primitive     | Owns |
|---------------|------|
| `Page`        | the route frame; tags `data-page-root`. `flush` mode for rhythm-band routes |
| `PageHeader`  | the standard route header band (eyebrow + title + dek) |
| `PageSection` | a content band within a route (optional eyebrow + body) |

**Editorial** — `Piece`, `PieceHeader`, `Prose`, `Lede`, `PullQuote`, `Figure`

| Primitive    | Owns |
|--------------|------|
| `Piece`      | the editorial container; reading measure + inter-block rhythm. Tags `data-piece-root` |
| `PieceHeader`| a piece masthead (category, date, headline, dek, byline) |
| `Prose`      | a long-form body block — token-styled paragraphs |
| `Lede`       | the opening standfirst paragraph |
| `PullQuote`  | an editorial pull quote with attribution |
| `Figure`     | the media / data-figure embed wrapper; framing + caption + width mode. Tags `data-figure` |

**Display** — `Card`, `Eyebrow`, `Stat`, `Divider`, `Badge`

**Typography** — `Text` (`scale`: caption / label / body / bodySm / lede /
subhead / head / display), `Heading` (`level` 1–4 → semantic tag + type role)

**Motion** — `AppearOnMount` (fade + rise on mount), `FadeIn` (opacity-only;
`whenInView` for below-the-fold). Both use the token `editorial` easing.
Motion wrappers go **inside** `Section`, never around it.

**Data figure** — `CompCurveFigure`, the reference interactive figure
(`packages/ui/src/figures/`). Custom-built SVG + React, token-driven, no
charting library.

---

## Layer 2 — the app shell

`src/components/layout/Layout.tsx` is pure chrome — navbar, footer, the
scroll container, the `<Outlet/>`. The `<main>` element imposes zero content
geometry. Do not add `max-w-*`, content padding, or a gap to the shell —
content geometry belongs to `Container` / `Section` / `Page`.

---

## Layer 3 — routes and pieces

Routes and editorial pieces render **content only — zero hand-rolled
geometry**. Every route opens with `<Page>`; every editorial piece opens with
`<Piece>`. Geometry comes exclusively from primitive props.

### A route

```tsx
import { Page, PageHeader, PageSection, Grid } from "@cq/ui";

export function Goods() {
  return (
    <Page>
      <PageHeader eyebrow="Goods" title="Four drops a year." dek="…" />
      <PageSection eyebrow="Latest">
        <Grid cols={3} gap="lg">{/* … */}</Grid>
      </PageSection>
    </Page>
  );
}
```

The homepage is a series of rhythm bands, so it uses `<Page flush>` — the
`<section>` bands stay direct children of `<main>`.

### An editorial piece — the `Piece` / `Figure` contract

```tsx
import { Piece, PieceHeader, Lede, Prose, PullQuote, Figure } from "@cq/ui";
import { CompCurveFigure } from "@cq/ui";

<Piece measure="prose" rhythm="xl">
  <PieceHeader category="…" headline="…" byline="…" />
  <Lede>The standfirst paragraph.</Lede>
  <Prose paragraphs={["…", "…"]} />
  <Figure width="wide" caption="…" source="…">
    <div data-reference-figure="">
      <CompCurveFigure data={/* … */} />
    </div>
  </Figure>
  <Prose paragraphs={["…"]} />
  <PullQuote cite="…">A quoted line.</PullQuote>
</Piece>
```

The figure is spaced by the `Piece`'s `rhythm` token like any other block; it
cannot break editorial rhythm, and the prose cannot hand-roll geometry around
it. See `DemoPiece` (`/pieces/demo`) for the full worked example.

### The geometry ban

The `cq/no-geometry` ESLint rule (`eslint-rules/no-geometry.js`) makes raw
geometry un-bypassable in route + piece files. This **fails `npm run lint`**:

```tsx
<div className="mx-auto max-w-2xl px-6">…</div>   // ✗ cq/no-geometry
```

Express it through primitives instead:

```tsx
<Container width="narrow"><Stack gap="lg">…</Stack></Container>   // ✓
```

If there is genuinely no token, route the one raw class through the explicit
escape hatch — `<Box unsafe_className="aspect-[3/1]">` — which the rule
exempts.

---

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `build:tokens` → `tsc -b` → `vite build` |
| `npm run build:tokens` | regenerate the three token artifacts |
| `npm run lint` | ESLint, including the `cq/no-geometry` rule |
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | build the static Storybook |
| `npm run test:a11y` | axe-core accessibility gate (routes + demo piece) |
| `npm run test:visual` | Playwright per-route / per-piece visual regression |

### Updating visual baselines

After an intentional visual change:

```sh
npm run build
npx playwright test --config=tests/visual.config.ts --update-snapshots
```

Then commit the updated `tests/visual.spec.ts-snapshots/`.

---

## Adding a primitive

1. Create it under the right `packages/ui/src/<category>/` folder. Token-typed
   props; no `className`; compose classes with `cn()`; literal class strings
   only (Tailwind's scanner needs whole class names).
2. Export it from `packages/ui/src/index.ts`.
3. Add a `*.stories.tsx` beside it.
4. If it is a layout primitive, decide whether the `no-geometry` rule's banned
   vocabulary needs it in the allow-set of layout primitives named in the rule
   message.
5. `npm run build && npm run lint && npm run test:a11y`.
