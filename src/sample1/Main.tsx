import React from "react"
import svglogo from "./logo.svg"
import { Border } from "./Gui"
import { SampleParts } from "./SampleParts"
import { SampleMultiple } from "./SampleMultiple"
import { CustomLineParts } from "./CustomLineParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"
import { SampleLights } from "./SampleLights"
import { Box, Text, Heading, Anchor } from "grommet"
import { name as pname, version } from "../../package.json"

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
      <Box>
         <Title />
         <Border />
         <SampleLogo />
         <Border />
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
   )
}
