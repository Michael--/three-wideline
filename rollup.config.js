// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import { string } from "rollup-plugin-string"
import { apiExtractor } from "rollup-plugin-api-extractor"

const config = [
   {
      input: "src/Wideline/index.tsx",
      output: {
         sourcemap: false,
         dir: "dist",
         format: "iife",
         name: "ThreeWideline",
         globals: {
            "react": "React",
            "react/jsx-runtime": "jsxRuntime",
            "three": "three",
         },
      },
      external: ["react", "react/jsx-runtime", "three"],
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
