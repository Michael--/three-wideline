import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import rawPlugin from "vite-raw-plugin" // as an alternative "rollup-plugin-string" are also supported by vite

export default defineConfig({
   build: {
      outDir: "build/sample1",
      chunkSizeWarningLimit: 1500,
      minify: 'terser',
      terserOptions: {
         compress: {
            drop_console: true,
            drop_debugger: true,
         },
      },
      rollupOptions: {
         output: {
            manualChunks: (id) => {
               // Separate chunk for Three.js and React Three Fiber
               if (id.includes('node_modules') && (
                  id.includes('three') ||
                  id.includes('@react-three/fiber') ||
                  id.includes('@react-three/drei')
               )) {
                  return 'vendor-three'
               }

               // Separate chunk for UI libraries
               if (id.includes('node_modules') && (
                  id.includes('react') ||
                  id.includes('grommet') ||
                  id.includes('styled-components')
               )) {
                  return 'vendor-ui'
               }

               // Keep samples in main bundle for now (they're small)
               return null
            },
         },
      },
   },
   server: {
      port: 3000,
   },
   plugins: [react(), rawPlugin({ fileRegex: /\.(vs|fs)$/ })],
})
