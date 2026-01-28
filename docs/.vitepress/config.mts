import { defineConfig } from "vitepress"

export default defineConfig({
   title: "three-wideline",
   description: "Wide line rendering for Three.js and React Three Fiber",
   ignoreDeadLinks: true,
   themeConfig: {
      nav: [
         { text: "Guide", link: "/" },
         { text: "API", link: "/api/" },
      ],
      sidebar: [
         {
            text: "Guide",
            items: [
               { text: "Overview", link: "/" },
               { text: "Performance Monitoring", link: "/PERFORMANCE" },
            ],
         },
         {
            text: "API Reference",
            items: [{ text: "Open API Reference", link: "/api/" }],
         },
      ],
   },
})
