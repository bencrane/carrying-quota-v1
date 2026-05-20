/**
 * @cq/ui — Carrying Quota's token-typed UI primitive package.
 *
 * Layer 1 of the four-layer design-system foundation. Every primitive:
 *   - takes TOKEN-TYPED geometry props (spacing/size/radius are token unions
 *     from @cq/tokens — the compiler rejects off-scale values);
 *   - exposes NO untyped `className` prop — the only caller class-injection
 *     point is the explicit `unsafe_className` escape hatch;
 *   - merges classes via the internal `cn()` helper.
 *
 * The dependency direction is one-way: @cq/tokens <- @cq/ui <- shell <- routes.
 */

/* ── Layout ──────────────────────────────────────────────────────────────── */
export { Box, type BoxProps } from "./layout/Box.js";
export { Stack, type StackProps } from "./layout/Stack.js";
export { Cluster, type ClusterProps } from "./layout/Cluster.js";
export { Grid, type GridProps, type GridCols } from "./layout/Grid.js";
export {
  Container,
  type ContainerProps,
  type ContainerWidth,
} from "./layout/Container.js";
export {
  Section,
  type SectionProps,
  type SectionSurface,
  type SectionGutter,
  type SectionDivide,
} from "./layout/Section.js";

/* ── Page ────────────────────────────────────────────────────────────────── */
export { Page, type PageProps } from "./page/Page.js";
export { PageHeader, type PageHeaderProps } from "./page/PageHeader.js";
export { PageSection, type PageSectionProps } from "./page/PageSection.js";

/* ── Editorial ───────────────────────────────────────────────────────────── */
export { Piece, type PieceProps } from "./editorial/Piece.js";
export { PieceHeader, type PieceHeaderProps } from "./editorial/PieceHeader.js";
export { Prose, type ProseProps } from "./editorial/Prose.js";
export { Lede, type LedeProps } from "./editorial/Lede.js";
export { PullQuote, type PullQuoteProps } from "./editorial/PullQuote.js";
export { Figure, type FigureProps, type FigureWidth } from "./editorial/Figure.js";

/* ── Display ─────────────────────────────────────────────────────────────── */
export { Card, type CardProps } from "./display/Card.js";
export { Eyebrow, type EyebrowProps } from "./display/Eyebrow.js";
export { Stat, type StatProps, type StatTrend } from "./display/Stat.js";
export { Divider, type DividerProps } from "./display/Divider.js";
export { Badge, type BadgeProps, type BadgeVariant } from "./display/Badge.js";

/* ── Typography ──────────────────────────────────────────────────────────── */
export {
  Text,
  type TextProps,
  type TextScale,
  type TextTone,
  type TextWrap,
} from "./typography/Text.js";
export {
  Heading,
  type HeadingProps,
  type HeadingLevel,
} from "./typography/Heading.js";

/* ── Motion ──────────────────────────────────────────────────────────────── */
export {
  AppearOnMount,
  type AppearOnMountProps,
} from "./motion/AppearOnMount.js";
export { FadeIn, type FadeInProps } from "./motion/FadeIn.js";

/* ── Data figures (the interactive figure family) ────────────────────────── */
export {
  CompCurveFigure,
  type CompCurveFigureProps,
  type CompDatum,
} from "./figures/CompCurveFigure.js";
export {
  CompIndexTable,
  type CompIndexTableProps,
  type CompIndexDatum,
} from "./figures/CompIndexTable.js";

/* ── Demo piece (the embed-contract proof fixture) ───────────────────────── */
export { DemoPiece } from "./pieces/DemoPiece.js";

/* ── Shared prop contract (token unions + the escape-hatch type) ─────────── */
export type { UnsafeClassName } from "./lib/props.js";
