import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [solidPlugin(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 8080,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  build: {
    target: "esnext",
  },
});
