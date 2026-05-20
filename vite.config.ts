import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Resolve the workspace packages to their SOURCE (not the node_modules
      // symlink). Two reasons:
      //   1. Tailwind v4's content scanner follows the Vite module graph but
      //      skips node_modules — aliasing @cq/ui to packages/ui/src puts the
      //      primitive class strings inside the scanned project tree, so
      //      primitive utilities are never purged (validator prediction p2).
      //   2. No build step for @cq/ui — Vite consumes the TS source directly.
      "@cq/ui": path.resolve(__dirname, "./packages/ui/src/index.ts"),
      "@cq/tokens": path.resolve(__dirname, "./packages/tokens/src/index.ts"),
    },
  },
});
