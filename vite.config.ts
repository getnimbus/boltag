import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), TanStackRouterVite()],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
