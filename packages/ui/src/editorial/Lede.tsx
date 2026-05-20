import type { ReactNode } from "react";
import { Text } from "../typography/Text.js";
import type { UnsafeClassName } from "../lib/props.js";

export interface LedeProps extends UnsafeClassName {
  children: ReactNode;
}

/**
 * The opening standfirst paragraph of a piece — serif, larger than body,
 * the bridge between the headline and the first prose block. A fixed
 * editorial type role; no size knobs, by design.
 */
export function Lede({ children, unsafe_className }: LedeProps) {
  return (
    <Text scale="lede" wrap="pretty" unsafe_className={unsafe_className}>
      {children}
    </Text>
  );
}
