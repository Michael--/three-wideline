import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import { string } from "rollup-plugin-string"
import { apiExtractor } from "rollup-plugin-api-extractor"
import { terser } from "rollup-plugin-terser"

const config = defineConfig({
   input: "src/Wideline/index.tsx",
   output: {
      sourcemap: false,
      dir: "dist",
      format: "iife",
      name: "ThreeWideline",
      globals: {
         react: "React",
         three: "three",
      },
   },

   external: ["react", "three"],
   plugins: [
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
