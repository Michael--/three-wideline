import React, { createContext, useContext, useState } from "react"
import { Main } from "./Main"

import { Grommet, ThemeType, Box } from "grommet"
import { grommet, dark } from "grommet/themes"

const lightTheme: ThemeType = {
   global: {
      font: {
         family: "Sans-serif",
         size: "16px",
      },
      colors: {
         background: "light-1",
      },
   },
}

const darkTheme: ThemeType = {
   global: {
      font: {
         family: "Sans-serif",
         size: "16px",
      },
      colors: {
         background: "dark-1",
      },
   },
}

interface ThemeContextType {
   isDark: boolean
   toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
   const context = useContext(ThemeContext)
   if (!context) throw new Error("useTheme must be used within ThemeProvider")
   return context
}

export function App() {
   const [isDark, setIsDark] = useState(false)

   const toggleTheme = () => setIsDark(!isDark)

   return (
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
         <Grommet
            theme={isDark ? { ...dark, ...darkTheme } : { ...grommet, ...lightTheme }}
            key={isDark ? "dark" : "light"}
         >
            <Box background="background" fill>
               <Main />
            </Box>
         </Grommet>
      </ThemeContext.Provider>
   )
}
