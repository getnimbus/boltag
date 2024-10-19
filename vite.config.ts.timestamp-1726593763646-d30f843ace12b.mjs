// vite.config.ts
import { defineConfig } from "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { windi } from "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/svelte-windicss-preprocess/dist/index.mjs";
import sveltePreprocess from "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/svelte-preprocess/dist/index.js";
import "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/@babel/core/lib/index.js";
import babelPresetReact from "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/@babel/preset-react/lib/index.js";
import path from "path";
import { nodePolyfills } from "file:///Users/binhnguyen/Desktop/nimbus-app/node_modules/vite-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "/Users/binhnguyen/Desktop/nimbus-app";
var vite_config_default = defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        // can also be 'build', 'dev', or false
        global: true,
        process: true
      }
    }),
    svelte({
      preprocess: [sveltePreprocess(
        {
          babel: {
            babelrc: false,
            presets: [
              [
                babelPresetReact,
                {
                  runtime: "automatic"
                }
              ]
            ]
          }
        }
      ), windi({})],
      experimental: {
        dynamicCompileOptions({ filename, compileOptions }) {
          return {
            ...compileOptions,
            customElement: filename.endsWith(".custom.svelte")
          };
        }
      }
    })
  ],
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./src"),
      "webext-bridge": path.resolve(__vite_injected_original_dirname, "./src/lib/web-bridge"),
      "webextension-polyfill": path.resolve(__vite_injected_original_dirname, "./src/lib/web-chrome")
    }
  },
  build: {
    target: ["es2020"],
    rollupOptions: {
      plugins: [
        // inject({ Buffer: ["buffer/", "Buffer"] }),
        // json(),
        // globals(),
        // builtins(),
      ],
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
    // outDir: path.resolve(__dirname, "web-build"),
    // sourcemap: env.WATCH === "true" ? "inline" : false,
  },
  optimizeDeps: {
    include: ["webextension-polyfill"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYmluaG5ndXllbi9EZXNrdG9wL25pbWJ1cy1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9iaW5obmd1eWVuL0Rlc2t0b3AvbmltYnVzLWFwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYmluaG5ndXllbi9EZXNrdG9wL25pbWJ1cy1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjtcbmltcG9ydCB7IHdpbmRpIH0gZnJvbSBcInN2ZWx0ZS13aW5kaWNzcy1wcmVwcm9jZXNzXCI7XG5pbXBvcnQgc3ZlbHRlUHJlcHJvY2VzcyBmcm9tIFwic3ZlbHRlLXByZXByb2Nlc3NcIjtcbmltcG9ydCBiYWJlbCBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQgYmFiZWxQcmVzZXRSZWFjdCBmcm9tICdAYmFiZWwvcHJlc2V0LXJlYWN0JztcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnXG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBub2RlUG9seWZpbGxzKHtcbiAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgQnVmZmVyOiB0cnVlLCAvLyBjYW4gYWxzbyBiZSAnYnVpbGQnLCAnZGV2Jywgb3IgZmFsc2VcbiAgICAgICAgZ2xvYmFsOiB0cnVlLFxuICAgICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBzdmVsdGUoe1xuICAgICAgcHJlcHJvY2VzczogW3N2ZWx0ZVByZXByb2Nlc3MoXG4gICAgICAgIHtcbiAgICAgICAgICBiYWJlbDoge1xuICAgICAgICAgICAgYmFiZWxyYzogZmFsc2UsXG4gICAgICAgICAgICBwcmVzZXRzOiBbXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBiYWJlbFByZXNldFJlYWN0LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJ1bnRpbWU6ICdhdXRvbWF0aWMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApLCB3aW5kaSh7fSldLFxuICAgICAgZXhwZXJpbWVudGFsOiB7XG4gICAgICAgIGR5bmFtaWNDb21waWxlT3B0aW9ucyh7IGZpbGVuYW1lLCBjb21waWxlT3B0aW9ucyB9KSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmNvbXBpbGVPcHRpb25zLFxuICAgICAgICAgICAgY3VzdG9tRWxlbWVudDogZmlsZW5hbWUuZW5kc1dpdGgoXCIuY3VzdG9tLnN2ZWx0ZVwiKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIn5cIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIFwid2ViZXh0LWJyaWRnZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2xpYi93ZWItYnJpZGdlXCIpLFxuICAgICAgXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9saWIvd2ViLWNocm9tZVwiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogW1wiZXMyMDIwXCJdLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgLy8gaW5qZWN0KHsgQnVmZmVyOiBbXCJidWZmZXIvXCIsIFwiQnVmZmVyXCJdIH0pLFxuICAgICAgICAvLyBqc29uKCksXG4gICAgICAgIC8vIGdsb2JhbHMoKSxcbiAgICAgICAgLy8gYnVpbHRpbnMoKSxcbiAgICAgIF0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLltoYXNoXS5bZXh0XWAsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIndlYi1idWlsZFwiKSxcbiAgICAvLyBzb3VyY2VtYXA6IGVudi5XQVRDSCA9PT0gXCJ0cnVlXCIgPyBcImlubGluZVwiIDogZmFsc2UsXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4UixTQUFTLG9CQUFvQjtBQUMzVCxTQUFTLGNBQWM7QUFDdkIsU0FBUyxhQUFhO0FBQ3RCLE9BQU8sc0JBQXNCO0FBQzdCLE9BQWtCO0FBQ2xCLE9BQU8sc0JBQXNCO0FBQzdCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQVA5QixJQUFNLG1DQUFtQztBQVd6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxjQUFjO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDUCxRQUFRO0FBQUE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsTUFDTCxZQUFZLENBQUM7QUFBQSxRQUNYO0FBQUEsVUFDRSxPQUFPO0FBQUEsWUFDTCxTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUDtBQUFBLGdCQUNFO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxTQUFTO0FBQUEsZ0JBQ1g7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFBQSxNQUNaLGNBQWM7QUFBQSxRQUNaLHNCQUFzQixFQUFFLFVBQVUsZUFBZSxHQUFHO0FBQ2xELGlCQUFPO0FBQUEsWUFDTCxHQUFHO0FBQUEsWUFDSCxlQUFlLFNBQVMsU0FBUyxnQkFBZ0I7QUFBQSxVQUNuRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLGlCQUFpQixLQUFLLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsTUFDL0QseUJBQXlCLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxJQUN6RTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVEsQ0FBQyxRQUFRO0FBQUEsSUFDakIsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLVDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBLEVBR0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxFQUNuQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
