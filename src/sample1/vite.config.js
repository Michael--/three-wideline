import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import rawPlugin from "vite-raw-plugin"

export default defineConfig({
   build: {
      outDir: "build/sample1",
      chunkSizeWarningLimit: 1500,
   },
   plugins: [react(), rawPlugin({ fileRegex: /\.(vs|fs)$/ })],
})
