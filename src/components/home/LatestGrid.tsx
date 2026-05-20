import { Section } from "@/components/primitives/Section";
import { Grid } from "@/components/primitives/Grid";
import { Stack } from "@/components/primitives/Stack";
import { Cluster } from "@/components/primitives/Cluster";
import { Text } from "@/components/primitives/Text";
import { ArticleCard } from "@/components/content/ArticleCard";
import { dispatches } from "@/data/dispatches";

export function LatestGrid() {
  return (
    <Section variant="primary" gutter="spacious" divide="bottom">
      <Stack gap="md" className="mb-12">
        <Cluster justify="between" align="baseline">
          <Text scale="caption" tone="accent" as="span">
            ↳ Latest
          </Text>
          <Text scale="caption" tone="muted" as="span">
            {dispatches.length} pieces
          </Text>
        </Cluster>
        <Text scale="head" as="h2">
          Dispatches from the floor
        </Text>
      </Stack>

      <Grid cols={3} gap="lg">
        {dispatches.map((piece, i) => (
          <ArticleCard key={piece.slug} piece={piece} index={i} />
        ))}
      </Grid>
    </Section>
  );
}
