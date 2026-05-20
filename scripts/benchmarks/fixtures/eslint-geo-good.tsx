// FIXTURE — input to the cq-design-system-foundation benchmark (check G1).
// This file expresses the SAME layout intent as eslint-geo-bad.tsx, but
// correctly: geometry comes from token-typed primitives, and the one place a
// raw utility class is genuinely needed routes through the explicit
// `unsafe_className` escape hatch (exempt from the `cq/no-geometry` rule).
// `npx eslint` on this file MUST exit zero.
//
// It is NOT part of the app — it is a positive test fixture.

import { Box, Container, Stack, Text } from "@cq/ui";

export function GeoGood() {
  return (
    <Container width="narrow">
      <Stack gap="lg">
        <Text scale="body">Geometry flows from token-typed primitive props.</Text>
        {/* The escape hatch — explicit, loud, exempt from the no-geometry rule. */}
        <Box unsafe_className="rotate-1">
          <Text scale="caption">
            An effect with no spacing token routes through unsafe_className.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
