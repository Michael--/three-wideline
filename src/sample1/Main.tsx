import React, { JSX } from "react"
import svglogo from "./logo.svg"
import { SampleParts } from "./SampleParts"
import { SampleMultiple } from "./SampleMultiple"
import { CustomLineParts } from "./CustomLineParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"
import { SampleLights } from "./SampleLights"
import { SampleRaycast } from "./SampleRaycast"
import { SamplePerformanceAnalysis } from "./SamplePerformanceAnalysis"
import { Box, Text, Heading, Anchor, Sidebar, Nav, RadioButton } from "grommet"
import { name as pname, version } from "../../package.json"
import { useLocation } from "wouter"
import { SampleFallback } from "./SampleFallback"

function Title() {
   const npmlink = "https://www.npmjs.com/package/three-wideline"
   return (
      <Box align="center" round="small" background={{ color: "brand", size: "large" }}>
         <Box direction="row" pad={"medium"} align="center" gap="medium">
            <img src={svglogo} className="App-logo" />
            <Box>
               <Heading>{`${pname}`}</Heading>
               <Text>{`Version: ${version}`}</Text>
               <Anchor href={npmlink}>{npmlink}</Anchor>
            </Box>
         </Box>
      </Box>
   )
}

interface IPage {
   route: string
   page: JSX.Element
}

const pages: IPage[] = [
   { route: "Logo", page: <SampleLogo /> },
   { route: "Parts", page: <SampleParts /> },
   { route: "Construction", page: <SampleConstruction /> },
   { route: "Custom", page: <CustomLineParts /> },
   { route: "Lights", page: <SampleLights /> },
   { route: "Multiple", page: <SampleMultiple /> },
   { route: "Raycast", page: <SampleRaycast /> },
   { route: "Performance", page: <SamplePerformanceAnalysis /> },
   { route: "Fallback", page: <SampleFallback /> },
]

export function Main() {
   const [location, setLocation] = useLocation()

   React.useEffect(() => {
      if (!location.includes(pages[0].route)) setLocation(pages[0].route)
   }, [])

   const page = React.useMemo(() => pages.find(e => location.endsWith(e.route))?.page, [location])

   return (
      <Box gap="small">
         <Title />
         <Box direction="row" gap="small">
            <Sidebar background="brand" round="small" header={<Heading level={3}>Samples</Heading>}>
               <Nav gap="small">
                  {pages.map((e, i) => (
                     <RadioButton
                        key={i}
                        name={e.route}
                        label={e.route}
                        checked={location.includes(e.route)}
                        onChange={() => setLocation(e.route ?? "")}
                     />
                  ))}
               </Nav>
            </Sidebar>
            <Box border={{ color: "dark-3", size: "medium" }}>{page}</Box>
         </Box>
      </Box>
   )
}
