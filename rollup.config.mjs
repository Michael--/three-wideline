import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import { string } from "rollup-plugin-string"
import { apiExtractor } from "rollup-plugin-api-extractor"
// import commonjs from "@rollup/plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import terser from "@rollup/plugin-terser"
import { visualizer } from "rollup-plugin-visualizer"

const config = defineConfig({
   input: "src/Wideline/index.tsx",
   output: {
      sourcemap: false,
      dir: "dist",
      format: "esm",
      name: "ThreeWideline",
   },
   external: ["react", "three"],
   plugins: [
      external(),
      // commonjs(),
      typescript({ tsconfig: "tsconfig-dist.json" }),
      string({ include: /\.(vs|fs)$/ }),
      terser({
         compress: {
            drop_console: true,
            drop_debugger: true,
         },
         mangle: true,
      }),
      apiExtractor({
         local: true,
         configFile: "./api-extractor.json",
      }),
      visualizer({
         title: "Statistics",
         filename: "dist/stats.html",
         template: "treemap",
         brotliSize: true,
         gzipSize: true,
         sourcemap: false,
      }),
   ],
})

export default config
