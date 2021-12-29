import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import { string } from "rollup-plugin-string"
import { apiExtractor } from "rollup-plugin-api-extractor"
import commonjs from "@rollup/plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import { terser } from "rollup-plugin-terser"

const config = defineConfig({
   input: "src/Wideline/index.tsx",
   output: {
      sourcemap: false,
      dir: "dist",
      format: "cjs",
      name: "ThreeWideline",
   },
   plugins: [
      external(),
      commonjs(),
      typescript({ tsconfig: "tsconfig-dist.json" }),
      string({ include: /\.(vs|fs)$/ }),
      terser(),
      apiExtractor({
         local: true,
         configFile: "./api-extractor.json",
      }),
   ],
})

export default config
