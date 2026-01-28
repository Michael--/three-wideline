import { defineConfig } from "vitepress"
import { withMermaid } from "vitepress-plugin-mermaid"

export default withMermaid(
   defineConfig({
      title: "three-wideline",
      description: "Wide line rendering for Three.js and React Three Fiber",
      ignoreDeadLinks: true,
      head: [["link", { rel: "icon", href: "/favicon.ico" }]],
      markdown: {
         // @ts-expect-error VitePress supports this, but TS picks wrong types
         mermaid: true,
      },
      mermaid: {
         flowchart: { htmlLabels: true },
         themeVariables: {
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
            fontSize: "16px",
         },
      },
      themeConfig: {
         logo: "/logo.svg",
         nav: [
            { text: "Guide", link: "/" },
            { text: "API", link: "/api/" },
         ],
         sidebar: [
            {
               text: "Guide",
               items: [
                  { text: "Overview", link: "/" },
                  { text: "Getting Started", link: "/getting-started" },
                  { text: "Features", link: "/features" },
                  { text: "Performance Monitoring", link: "/PERFORMANCE" },
                  { text: "Development", link: "/development" },
               ],
            },
            {
               text: "API Reference",
               items: [{ text: "Open API Reference", link: "/api/" }],
            },
         ],
      },
      vite: {
         ssr: { noExternal: ["mermaid"] },
         optimizeDeps: {
            include: ["mermaid", "@braintree/sanitize-url", "dayjs", "debug", "cytoscape-cose-bilkent", "cytoscape"],
         },
      },
   }),
)
