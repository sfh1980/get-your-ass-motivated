import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "GYAM",
        short_name: "GYAM",
        description: "Get Your Ass Motivated — PM career operating system",
        theme_color: "#0f1419",
        background_color: "#0f1419",
        display: "standalone",
        start_url: "/",
      },
      workbox: {
        navigateFallback: "/index.html",
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4070",
        changeOrigin: true,
      },
    },
  },
});
