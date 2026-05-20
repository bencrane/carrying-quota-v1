// FIXTURE — input to the cq-design-system-foundation benchmark (check P2).
//
// Token-typed props, POSITIVE case. The SAME primitives and props as
// ts-bad/fixture.tsx, but every value is a valid member of its token union
// from @cq/tokens. `tsc --noEmit` MUST accept it (exit zero). It is not part
// of the app.

import { Stack, Container, Box } from "@cq/ui";

export function TsGood() {
  return (
    // `width` -> ContainerWidth, `gap` -> SpacingToken, `pad` -> SpacingToken,
    // `radius` -> RadiusToken — all on-scale token values.
    <Container width="narrow">
      <Stack gap="lg">
        <Box pad="md" radius="none">
          <span>Valid token values — the compiler accepts these.</span>
        </Box>
      </Stack>
    </Container>
  );
}
