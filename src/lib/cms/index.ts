import { mockCMS } from "./mock";
import type { CMSClient } from "./types";

// Swap to `sanityCMS` once the Sanity client is wired up.
export const cms: CMSClient = mockCMS;

export type { Article, Author, CMSClient } from "./types";
