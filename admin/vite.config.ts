import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The admin panel is served from the /admin/ sub-path of the GitHub Pages site
// (https://account.yesastudio.com/admin/ and https://admin.yesastudio.com/).
export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    watch: {
      // Never watch secret key material: locked files crash the dev watcher,
      // and these must never be served or bundled.
      ignored: [
        "**/*firebase-adminsdk*.json",
        "**/service-account*.json",
        "**/*.pem",
      ],
    },
  },
});
