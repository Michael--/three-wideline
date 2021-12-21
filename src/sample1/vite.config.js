import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import viteTsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
   build: {
      outDir: "build/sample1",
      chunkSizeWarningLimit: 1500,
   },
   plugins: [react(), viteTsconfigPaths()],
})
