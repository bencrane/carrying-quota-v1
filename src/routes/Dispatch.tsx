import { useParams, Link } from "react-router";
import {
  Page,
  Section,
  Piece,
  PieceHeader,
  Prose,
  Stack,
  Box,
  Text,
  Eyebrow,
  Heading,
  AppearOnMount,
  FadeIn,
} from "@cq/ui";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";
import { AbstractBanner } from "@/components/editorial/AbstractBanner";
import { getDispatch, dispatches } from "@/data/dispatches";

/**
 * A single dispatch — an editorial piece. Rendered through `Page`, composed
 * from `@cq/ui` editorial primitives (`Piece` / `PieceHeader` / `Prose`).
 * Zero hand-rolled geometry: the one place a raw class is genuinely needed —
 * the banner's aspect ratio — routes through the explicit `unsafe_className`
 * escape hatch.
 */
export function Dispatch() {
  const { slug } = useParams();
  const piece = slug ? getDispatch(slug) : undefined;

  if (!piece) {
    return (
      <Page>
        <Section surface="primary" gutter="spacious" divide="none" container="narrow">
          <AppearOnMount>
            <Stack gap="md">
              <Eyebrow>Dispatch</Eyebrow>
              <Heading level={1}>This piece is still in production.</Heading>
              <Text scale="body" tone="muted">
                We haven't published this one yet. Subscribe and it lands in
                your inbox the Tuesday it does.
              </Text>
              <SubscribeForm socialProof="Free forever · No spam" />
              <Link to="/dispatches">
                <Eyebrow marker={false}>
                  <span aria-hidden="true">← </span>All dispatches
                </Eyebrow>
              </Link>
            </Stack>
          </AppearOnMount>
        </Section>
      </Page>
    );
  }

  const seed = dispatches.findIndex((d) => d.slug === piece.slug);

  return (
    <Page>
      <Section surface="primary" gutter="compact" divide="none" container="narrow">
        <FadeIn>
          <Box
            border="all"
            surface="card"
            unsafe_className="relative aspect-[3/1] w-full overflow-hidden"
          >
            <AbstractBanner seed={seed} />
          </Box>
        </FadeIn>
      </Section>

      <Section surface="primary" gutter="spacious" divide="bottom" container={false}>
        <AppearOnMount>
          <Piece measure="narrow" rhythm="xl">
            <PieceHeader
              category={piece.category}
              date={piece.date}
              headline={piece.title}
              dek={piece.dek}
              byline={piece.byline}
            />
            {piece.body ? (
              <Prose paragraphs={piece.body} />
            ) : (
              <Text scale="body" tone="muted">
                The full piece is in production. Subscribe to get it the
                Tuesday it lands.
              </Text>
            )}
          </Piece>
        </AppearOnMount>
      </Section>

      <Section surface="elevated" gutter="default" divide="bottom" container="narrow">
        <Stack gap="md">
          <Eyebrow>Keep reading</Eyebrow>
          <Text scale="lede">
            One email, Tuesday mornings. The data, the dispatch, the drop.
          </Text>
          <SubscribeForm socialProof="Free forever · 12,847 reading" />
        </Stack>
      </Section>
    </Page>
  );
}
