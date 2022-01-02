import React from "react"
import svglogo from "./logo.svg"
import { Border } from "./Gui"
import { SampleParts } from "./SampleParts"
import { SampleMultiple } from "./SampleMultiple"
import { CustomLineParts } from "./CustomLineParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"
import { SampleLights } from "./SampleLights"
import { Box, Text, Heading, Anchor, Sidebar, Nav } from "grommet"
import { name as pname, version } from "../../package.json"
import { Logo } from "../Wideline"

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

export function Main() {
   return (
      <Box gap="small">
         <Title />
         <Box direction="row">
            <Sidebar background="brand" round="small" header={<img src={svglogo} />}>
               <Nav gap="small" border="all">
                  <Text>DEPP</Text>
               </Nav>
            </Sidebar>
            <Box gap="small">
               <SampleLogo />
               <SampleParts />
               <Border />
               <CustomLineParts />
               <Border />
               <SampleConstruction />
               <Border />
               <SampleLights />
               <Border />
               <SampleMultiple />
               <Border />
            </Box>
         </Box>
      </Box>
   )
}
