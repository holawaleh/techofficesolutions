import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  // conditionally load replit dev plugins only when available and in a REPL environment
  const replitPlugins = [];
  const env = (globalThis as any).process?.env;
  if (env && env.NODE_ENV !== "production" && env.REPL_ID !== undefined) {
    try {
      const carto = await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer());
      const devBanner = await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner());
      replitPlugins.push(carto, devBanner);
    } catch (e) {
      // plugin not available, ignore
      // eslint-disable-next-line no-console
      console.warn("Replit dev plugins not available:", (e as any)?.message || e);
    }
  }

  return {
    plugins: [
      react(),
      // try to load the runtime error overlay if available; ignore if not installed
      ...(await (async () => {
        try {
            const mod = await import("@replit/vite-plugin-runtime-error-modal");
            const exported = mod.default ?? mod;
            if (typeof exported === "function") {
              return [exported()];
            }
            // plugin module doesn't export a callable default - ignore
            return [] as any[];
          } catch {
            return [] as any[];
          }
      })()),
      ...replitPlugins,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
