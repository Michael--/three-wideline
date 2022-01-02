import React from "react"
import svglogo from "./logo.svg"
import { HBox, VBox, Body, Border, Flex } from "./Gui"
import { SampleParts } from "./SampleParts"
import { SampleMultiple } from "./SampleMultiple"
import { CustomLineParts } from "./CustomLineParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"
import { SampleLights } from "./SampleLights"
import { name as pname, version } from "../../package.json"

function Title() {
   const npmlink = "https://www.npmjs.com/package/three-wideline"
   return (
      <VBox>
         <HBox>
            <Body />
            <img style={{ paddingRight: "20px" }} src={svglogo} className="App-logo" />
            <h1>{`${pname}`}</h1>
            <p>{`${version}`}</p>
            <Body />
         </HBox>
         <HBox>
            <a href={npmlink}>{npmlink}</a>
         </HBox>
      </VBox>
   )
}

export function Main() {
   return (
      <Flex>
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
      </Flex>
   )
}
