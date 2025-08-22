import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/project-exam-2/",
  plugins: [react(), tailwindcss() as PluginOption],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
