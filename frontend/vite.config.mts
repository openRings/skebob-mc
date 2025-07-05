import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [solidPlugin(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  build: {
    target: "esnext",
  },
});
