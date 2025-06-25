import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    TanStackRouterVite(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      includeAssets: [
        "favicon-196.png",
        "manifest-icon-192.maskable.png",
        "manifest-icon-512.maskable.png",
        "apple-icon-180.png",
        "apple-splash-640-1136.jpg",
        "apple-splash-1136-640.jpg",
        "apple-splash-750-1334.jpg",
        "apple-splash-1334-750.jpg",
        "apple-splash-1242-2208.jpg",
        "apple-splash-2208-1242.jpg",
        "apple-splash-1125-2436.jpg",
        "apple-splash-2436-1125.jpg",
        "apple-splash-828-1792.jpg",
        "apple-splash-1792-828.jpg",
        "apple-splash-1242-2688.jpg",
        "apple-splash-2688-1242.jpg",
        "apple-splash-1170-2532.jpg",
        "apple-splash-2532-1170.jpg",
        "apple-splash-1284-2778.jpg",
        "apple-splash-2778-1284.jpg",
        "apple-splash-1179-2556.jpg",
        "apple-splash-2556-1179.jpg",
        "apple-splash-1290-2796.jpg",
        "apple-splash-2796-1290.jpg",
        "apple-splash-1206-2622.jpg",
        "apple-splash-2622-1206.jpg",
        "apple-splash-1320-2868.jpg",
        "apple-splash-2868-1320.jpg",
        "apple-splash-1488-2266.jpg",
        "apple-splash-2266-1488.jpg",
        "apple-splash-1620-2160.jpg",
        "apple-splash-2160-1620.jpg",
        "apple-splash-1668-2224.jpg",
        "apple-splash-2224-1668.jpg",
        "apple-splash-1640-2360.jpg",
        "apple-splash-2360-1640.jpg",
        "apple-splash-1536-2048.jpg",
        "apple-splash-2048-1536.jpg",
        "apple-splash-1668-2388.jpg",
        "apple-splash-2388-1668.jpg",
        "apple-splash-2048-2732.jpg",
        "apple-splash-2732-2048.jpg",
      ],
      manifest: {
        name: "Bolt.ag by Nimbus",
        short_name: "Bolt.ag",
        description:
          "Get the best swap routes from FlowX, Cetus, Aftermath, NAVI and 7K",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "favicon-196.png",
            sizes: "196x196",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
