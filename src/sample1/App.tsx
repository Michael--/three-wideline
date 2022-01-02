import React from "react"
import { Main } from "./Main"

import { Grommet, ThemeType } from "grommet"

const theme: ThemeType = {
   global: {
      font: {
         family: "Sans-serif",
         size: "16px",
      },
   },
}

export function App() {
   return (
      <Grommet theme={theme}>
         <Main />
      </Grommet>
   )
}
