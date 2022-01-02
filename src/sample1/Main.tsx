import React from "react"
import svglogo from "./logo.svg"
import { SampleParts } from "./SampleParts"
import { SampleMultiple } from "./SampleMultiple"
import { CustomLineParts } from "./CustomLineParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"
import { SampleLights } from "./SampleLights"
import { Box, Text, Heading, Anchor, Sidebar, Nav, Paragraph } from "grommet"
import { name as pname, version } from "../../package.json"
import { Route, Switch, useLocation } from "wouter"

function Title() {
   const npmlink = "https://www.npmjs.com/package/three-wideline"
   return (
      <Box align="center" border={{ color: "brand", size: "large" }}>
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
]

const ActiveLink = (props: { href: string; children?: React.ReactNode }) => {
   const [location, setLocation] = useLocation()
   const isActive = location.includes(props.href)

   return (
      <div
         {...props}
         className={isActive ? "active" : ""}
         onClick={() => {
            setLocation(props.href ?? "")
         }}
      >
         <a>{props.children}</a>
         {isActive && <a>{` *${isActive}* ${location}`}</a>}
      </div>
   )
}

export function Main() {
   const [location, setLocation] = useLocation()

   React.useEffect(() => {
      if (!location.includes(pages[0].route)) setLocation(pages[0].route)
   }, [])
   return (
      <Box gap="small">
         <Title />
         <Box direction="row">
            <Sidebar background="brand" round="small" header={<img src={svglogo} />}>
               <Nav gap="small" border="all">
                  {pages.map((e, i) => (
                     <ActiveLink key={i} href={e.route}>
                        {e.route}
                     </ActiveLink>
                  ))}
               </Nav>
            </Sidebar>
            <Box gap="small">
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
                  <Route>404, Not Found!</Route>
               </Switch>
            </Box>
         </Box>
      </Box>
   )
}
