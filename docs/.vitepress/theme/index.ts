import DefaultTheme from "vitepress/theme"
import "./custom.css"
import ExampleWideline from "./components/ExampleWideline.vue"

export default {
   ...DefaultTheme,
   enhanceApp({ app }) {
      app.component("ExampleWideline", ExampleWideline)
   },
}
