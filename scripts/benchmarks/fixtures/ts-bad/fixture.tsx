// FIXTURE — input to the cq-design-system-foundation benchmark (check P2).
//
// Token-typed props, NEGATIVE case. Every geometry prop on a @cq/ui primitive
// is typed to a token union from @cq/tokens. This file passes OFF-SCALE values
// — strings that are NOT members of those unions. `tsc --noEmit` MUST reject
// it (exit non-zero). It is not part of the app.

import { Stack, Container, Box } from "@cq/ui";

export function TsBad() {
  return (
    // `gap` is SpacingToken — "huge" is off-scale; `width` is ContainerWidth —
    // "gigantic" is off-scale; `pad` is SpacingToken — "999" is off-scale.
    <Container width="gigantic">
      <Stack gap="huge">
        <Box pad="999">
          <span>Off-scale token values — the compiler rejects these.</span>
        </Box>
      </Stack>
    </Container>
  );
}
