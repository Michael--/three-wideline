// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"

const config = [
   {
      input: "src/Wideline/index.tsx",
      output: {
         // name: "bla",
         //declarationDir: "./dts",
         dir: "dist",
         format: "cjs",
      },
      plugins: [typescript()],
   },
   {
      input: "dist/types/index.d.ts",
      output: [{ file: "dist/index.d.ts", format: "es" }],
      plugins: [dts()],
   },
]

export default config
