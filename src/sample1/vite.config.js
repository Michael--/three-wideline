import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import rawPlugin from "vite-raw-plugin" // as an alternative "rollup-plugin-string" are also supported by vite

/**
 * Plugin to remove sourceMappingURL comments from node_modules files
 * This prevents Chrome DevTools from trying to load missing source maps
 */
function removeNodeModulesSourceMaps() {
   return {
      name: "remove-node-modules-sourcemaps",
      transform(code, id) {
         if (id.includes("node_modules")) {
            // Remove sourceMappingURL comments
            return {
               code: code.replace(/\/\/# sourceMappingURL=.*/g, ""),
               map: null,
            }
         }
      },
   }
}

export default defineConfig({
   build: {
      outDir: "build/sample1",
      chunkSizeWarningLimit: 1500,
      sourcemap: false, // Disable for production builds
      minify: "terser",
      terserOptions: {
         compress: {
            drop_console: true,
            drop_debugger: true,
         },
      },
      rollupOptions: {
         onwarn(warning, warn) {
            // Suppress vite-raw-plugin sourcemap warnings
            if (warning.code === "SOURCEMAP_ERROR" && warning.plugin === "vite-raw-plugin") {
               return
            }
            warn(warning)
         },
         output: {
            sourcemapExcludeSources: false,
            manualChunks: id => {
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
      sourcemapIgnoreList(sourcePath) {
         // Ignore source maps for all node_modules to suppress warnings in dev mode
         return sourcePath.includes("node_modules")
      },
   },
   plugins: [
      removeNodeModulesSourceMaps(), // Remove source map references from node_modules
      react(),
      rawPlugin({
         fileRegex: /\.(vs|fs)$/,
         // Disable sourcemap for raw plugin to avoid warnings
         sourcemap: false,
      }),
   ],
})
