import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production",
    }),
  ],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@context": path.resolve(__dirname, "src/context"),
      "@store": path.resolve(__dirname, "src/store"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
}));
// To automatically open the app in the browser whenever the server starts,
// uncomment the following lines:
// server: {
//   open: true
// }
