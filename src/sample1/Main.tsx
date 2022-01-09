import React from "react"
import svglogo from "./logo.svg"
import { SampleParts } from "./SampleParts"
import { SampleMultiple } from "./SampleMultiple"
import { CustomLineParts } from "./CustomLineParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"
import { SampleLights } from "./SampleLights"
import { SampleRaycast } from "./SampleRaycast"
import { Box, Text, Heading, Anchor, Sidebar, Nav, RadioButton } from "grommet"
import { name as pname, version } from "../../package.json"
import { Route, Switch, useLocation } from "wouter"

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
}

const pages: IPage[] = [
   { route: "Logo" },
   { route: "Parts" },
   { route: "Construction" },
   { route: "Custom" },
   { route: "Lights" },
   { route: "Multiple" },
   { route: "Raycast" },
]

export function Main() {
   const [location, setLocation] = useLocation()

   React.useEffect(() => {
      if (!location.includes(pages[0].route)) setLocation(pages[0].route)
   }, [])
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
            <Box border={{ color: "dark-3", size: "medium" }}>
               <Switch>
                  <Route path="/Logo">
                     <SampleLogo />
                  </Route>
                  <Route path="/Parts">
                     <SampleParts />
                  </Route>
                  <Route path="/Construction">
                     <SampleConstruction />
                  </Route>
                  <Route path="/Custom">
                     <CustomLineParts />
                  </Route>
                  <Route path="/Lights">
                     <SampleLights />
                  </Route>
                  <Route path="/Multiple">
                     <SampleMultiple />
                  </Route>
                  <Route path="/Raycast">
                     <SampleRaycast />
                  </Route>
                  <Route>404, Not Found!</Route>
               </Switch>
            </Box>
         </Box>
      </Box>
   )
}
