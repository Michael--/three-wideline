import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { App } from "./App"

const dom = (
   <React.StrictMode>
      <App />
   </React.StrictMode>
)

ReactDOM.render(dom, document.getElementById("root"))
