import React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"

const start = () => {
   const dom = (
      <React.StrictMode>
         <App />
      </React.StrictMode>
   )
   ReactDOM.render(dom, document.getElementById("root"))
}
export default start
