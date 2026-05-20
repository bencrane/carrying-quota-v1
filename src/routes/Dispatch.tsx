import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Cluster } from "@/components/primitives/Cluster";
import { Text } from "@/components/primitives/Text";
import { SubscribeForm } from "@/components/editorial/SubscribeForm";
import { AbstractBanner } from "@/components/editorial/AbstractBanner";
import { getDispatch, dispatches } from "@/data/dispatches";

export function Dispatch() {
  const { slug } = useParams();
  const piece = slug ? getDispatch(slug) : undefined;

  if (!piece) {
    return (
      <Section variant="primary" gutter="spacious" divide="none" container="narrow">
        <Stack gap="md">
          <Text scale="caption" tone="accent" as="span">
            ↳ Dispatch
          </Text>
          <Text scale="head" as="h1">
            This piece is still in production.
          </Text>
          <Text scale="body" tone="muted" as="p">
            We haven't published this one yet. Subscribe and it lands in your
            inbox the Tuesday it does.
          </Text>
          <div className="pt-4">
            <SubscribeForm socialProof="Free forever · No spam" />
          </div>
          <Link to="/dispatches" className="pt-2">
            <Text scale="caption" tone="accent" as="span">
              ← All dispatches
            </Text>
          </Link>
        </Stack>
      </Section>
    );
  }

  const seed = dispatches.findIndex((d) => d.slug === piece.slug);

  return (
    <>
      <Section variant="primary" gutter="compact" divide="none" container="narrow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[3/1] w-full overflow-hidden border border-border bg-card"
        >
          <AbstractBanner seed={seed} />
        </motion.div>
      </Section>

      <Section variant="primary" gutter="spacious" divide="bottom" container="narrow">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stack gap="lg">
            <Stack gap="md">
              <Cluster gap="sm" align="baseline">
                <Text scale="caption" tone="accent" as="span">
                  {piece.category}
                </Text>
                <Text scale="caption" tone="muted" as="span">
                  {piece.date}
                </Text>
              </Cluster>
              <Text scale="head" as="h1" className="text-balance">
                {piece.title}
              </Text>
              <Text scale="lede" tone="muted" as="p">
                {piece.dek}
              </Text>
              <Text scale="caption" tone="muted" as="span">
                {piece.byline}
              </Text>
            </Stack>

            {piece.body ? (
              <Stack gap="md">
                {piece.body.map((para, i) => (
                  <Text key={i} scale="body" as="p">
                    {para}
                  </Text>
                ))}
              </Stack>
            ) : (
              <Text scale="body" tone="muted" as="p">
                The full piece is in production. Subscribe to get it the Tuesday
                it lands.
              </Text>
            )}
          </Stack>
        </motion.div>
      </Section>

      <Section variant="elevated" gutter="default" divide="bottom" container="narrow">
        <Stack gap="md">
          <Text scale="caption" tone="accent" as="span">
            ↳ Keep reading
          </Text>
          <Text scale="lede" as="p">
            One email, Tuesday mornings. The data, the dispatch, the drop.
          </Text>
          <SubscribeForm socialProof="Free forever · 12,847 reading" />
        </Stack>
      </Section>
    </>
  );
}
