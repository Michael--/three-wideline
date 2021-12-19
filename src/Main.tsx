import svglogo from "./logo.svg"
import { HBox, Body, Border, Flex } from "./Gui"
import { SampleParts } from "./SampleParts"
import { SampleConstruction } from "./SampleConstruction"
import { SampleLogo } from "./SampleLogo"

function Title() {
   return (
      <HBox>
         <img src={svglogo} className="App-logo" />
         <Body />
         <h1>Three-Wideline drawn itself</h1>
         <Body />
      </HBox>
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
         <SampleConstruction />
         <Border />
      </Flex>
   )
}
