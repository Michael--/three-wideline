import React, { JSX, lazy, Suspense } from "react"
import svglogo from "./logo.svg"
import { Box, Text, Heading, Anchor, Sidebar, Nav, Button, TextInput } from "grommet"
import { Moon, Sun, Image, StatusGood, Tools, Configure, Group, Cursor, Analytics, Alert } from "grommet-icons"
import { name as pname, version } from "../../package.json"
import { useLocation } from "wouter"
import { useTheme } from "./App"

const SampleParts = lazy(() => import("./SampleParts").then(m => ({ default: m.SampleParts })))
const SampleMultiple = lazy(() => import("./SampleMultiple").then(m => ({ default: m.SampleMultiple })))
const CustomLineParts = lazy(() => import("./CustomLineParts").then(m => ({ default: m.CustomLineParts })))
const SampleConstruction = lazy(() => import("./SampleConstruction").then(m => ({ default: m.SampleConstruction })))
const SampleLogo = lazy(() => import("./SampleLogo").then(m => ({ default: m.SampleLogo })))
const SampleLights = lazy(() => import("./SampleLights").then(m => ({ default: m.SampleLights })))
const SampleRaycast = lazy(() => import("./SampleRaycast").then(m => ({ default: m.SampleRaycast })))
const SamplePerformanceAnalysis = lazy(() =>
   import("./SamplePerformanceAnalysis").then(m => ({ default: m.SamplePerformanceAnalysis })),
)
const SampleFallback = lazy(() => import("./SampleFallback").then(m => ({ default: m.SampleFallback })))

function Title() {
   const { isDark, toggleTheme } = useTheme()
   const npmlink = "https://www.npmjs.com/package/three-wideline"
   return (
      <Box align="center" round="small" background={isDark ? "dark-1" : { color: "brand", size: "large" }} pad="medium">
         <Box direction="row" align="center" gap="medium">
            <img src={svglogo} className="App-logo" />
            <Box>
               <Heading>{`${pname}`}</Heading>
               <Text>{`Version: ${version}`}</Text>
               <Anchor href={npmlink}>{npmlink}</Anchor>
            </Box>
            <Button icon={isDark ? <Sun /> : <Moon />} onClick={toggleTheme} tip="Toggle Dark Mode" />
         </Box>
      </Box>
   )
}

interface IPage {
   route: string
   component: React.ComponentType
   icon: JSX.Element
}

const pages: IPage[] = [
   { route: "Logo", component: SampleLogo, icon: <Image /> },
   { route: "Parts", component: SampleParts, icon: <StatusGood /> },
   { route: "Construction", component: SampleConstruction, icon: <Tools /> },
   { route: "Custom", component: CustomLineParts, icon: <Configure /> },
   { route: "Lights", component: SampleLights, icon: <Sun /> },
   { route: "Multiple", component: SampleMultiple, icon: <Group /> },
   { route: "Raycast", component: SampleRaycast, icon: <Cursor /> },
   { route: "Performance", component: SamplePerformanceAnalysis, icon: <Analytics /> },
   { route: "Fallback", component: SampleFallback, icon: <Alert /> },
]

export function Main() {
   const [location, setLocation] = useLocation()
   const { isDark } = useTheme()
   const [searchTerm, setSearchTerm] = React.useState("")

   const filteredPages = React.useMemo(
      () => pages.filter(p => p.route.toLowerCase().includes(searchTerm.toLowerCase())),
      [searchTerm],
   )

   React.useEffect(() => {
      if (!location.includes(pages[0].route)) setLocation(pages[0].route)
   }, [])

   const Component = React.useMemo(() => pages.find(e => location.endsWith(e.route))?.component, [location])

   return (
      <Box gap="small" pad="medium">
         <Title />
         <Box direction="row" gap="small">
            <Sidebar
               background={isDark ? "dark-2" : "brand"}
               round="small"
               header={<Heading level={3}>Samples</Heading>}
            >
               <TextInput
                  placeholder="Search samples..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
               <Nav gap="small">
                  {filteredPages.map((e, i) => (
                     <Box
                        key={i}
                        direction="row"
                        align="center"
                        gap="small"
                        pad="small"
                        round="small"
                        background={location.includes(e.route) ? "brand" : undefined}
                        onClick={() => setLocation(e.route ?? "")}
                        hoverIndicator
                     >
                        {e.icon}
                        <Text>{e.route}</Text>
                     </Box>
                  ))}
               </Nav>
            </Sidebar>
            <Box border={{ color: "dark-3", size: "medium" }} background="background">
               <Suspense fallback={<Box pad="medium">Loading...</Box>}>{Component && <Component />}</Suspense>
            </Box>
         </Box>
      </Box>
   )
}
