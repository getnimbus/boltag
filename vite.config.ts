import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { windi } from "svelte-windicss-preprocess";
import sveltePreprocess from "svelte-preprocess";
import babel from '@babel/core';
import babelPresetReact from '@babel/preset-react';
import path from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
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
                  runtime: 'automatic'
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
            customElement: filename.endsWith(".custom.svelte"),
          };
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "webext-bridge": path.resolve(__dirname, "./src/lib/web-bridge"),
      "webextension-polyfill": path.resolve(__dirname, "./src/lib/web-chrome"),
    },
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
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
    // outDir: path.resolve(__dirname, "web-build"),
    // sourcemap: env.WATCH === "true" ? "inline" : false,
  },
  optimizeDeps: {
    include: ["webextension-polyfill"],
  },
});
