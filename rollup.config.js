// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import { string } from "rollup-plugin-string"
import { apiExtractor } from "rollup-plugin-api-extractor"

const config = [
   {
      input: "src/Wideline/index.tsx",
      output: {
         sourcemap: true,
         dir: "dist",
         format: "iife",
      },
      plugins: [
         typescript({ tsconfig: "tsconfig-dist.json" }),
         string({ include: /\.(vs|fs)$/ }),
         apiExtractor({
            local: true,
            configFile: "./api-extractor.json",
         }),
      ],
   },
]

export default config
