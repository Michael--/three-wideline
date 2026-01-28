import DefaultTheme from "vitepress/theme"
import "./custom.css"
import ExampleWideline from "./components/ExampleWideline.vue"
import { EnhanceAppContext } from "vitepress"

export default {
   ...DefaultTheme,
   enhanceApp({ app }: EnhanceAppContext) {
      app.component("ExampleWideline", ExampleWideline)
   },
}
