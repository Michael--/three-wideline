import { Logo } from "./Logo"
import { HBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleLogo() {
   return (
      <HBox>
         <h3>Wideline Logo drawn itself</h3>
         <Body />
         <ThreeCanvas scale={5} width={"200px"}>
            <Logo />
         </ThreeCanvas>
      </HBox>
   )
}
