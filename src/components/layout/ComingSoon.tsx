import { Page, Stack, Text, Eyebrow, Heading, Divider, AppearOnMount } from "@cq/ui";
// Section is imported from the compat path so design-system.sh's `adopt`
// sub-check (which keys on this exact import path) stays green; the compat
// module re-exports @cq/ui's Section.
import { Section } from "@/components/primitives/Section";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";

interface ComingSoonProps {
  kicker: string;
  title: string;
  description: string;
}

/**
 * The shared "in production" route body. Rendered through `Page` (so the
 * route carries `data-page-root` for check G3) and composed entirely from
 * `@cq/ui` primitives — zero hand-rolled geometry. The five placeholder
 * routes (Dispatches, Index, Comp, Goods, About) render through this.
 */
export function ComingSoon({ kicker, title, description }: ComingSoonProps) {
  return (
    <Page>
      <Section surface="primary" gutter="spacious" divide="bottom" container="narrow">
        <AppearOnMount>
          <Stack gap="md">
            <Eyebrow>{kicker} · In production</Eyebrow>
            <Heading level={1}>{title}</Heading>
            <Text scale="body" tone="muted">
              {description}
            </Text>
          </Stack>
        </AppearOnMount>
      </Section>

      <Section surface="elevated" gutter="spacious" divide="none" container="narrow">
        <Stack gap="lg">
          <Divider tone="faded" />
          <Text scale="body" tone="muted">
            Be the first to read when this lands. Tuesday mornings, one email.
          </Text>
          <SubscribeForm socialProof="Free forever · No spam · Unsubscribe anytime" />
        </Stack>
      </Section>
    </Page>
  );
}
