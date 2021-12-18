import { useMemo, ReactNode, useState, CSSProperties } from "react"
import { Canvas } from "@react-three/fiber"
import { Vector2 } from "three"
import { Wideline } from "./Wideline"
import { Logo } from "./Logo"
import { generatePointsInterleaved } from "./Wideline"
import svglogo from "./logo.svg"
import { SketchPicker } from "react-color"

function Sample1() {
   const points = useMemo(() => {
      return [
         [1, 0.5],
         [1, -1],
         [2, 0.75],
         [4, 1],
         [5.0, 0],
         [4.1, 0.2],
      ].flat()
   }, [])

   return (
      <HBox>
         <h3>Show parts of line in different color</h3>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <Wideline
               position={[-3, 0, 0]}
               points={points}
               scale={[1, 1, 1]}
               attr={{
                  color: "yellow",
                  offals: "red",
                  width: 0.5,
               }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
         </ThreeCanvas>
      </HBox>
   )
}

function Sample2() {
   const [edges, setEdges] = useState(8)
   const [dimension, setDimension] = useState(5)
   const [width, setWidth] = useState(0.2)
   const [checked, setChecked] = useState(false)
   const [color1, setColor1] = useState("red")
   const [picker, setPicker] = useState({ show: false, x: 0, y: 0 })

   const styleColor: CSSProperties = {
      borderRadius: "4px",
      padding: "4px",
      backgroundColor: color1,
      // color: e.g. inverse of color1,
   }

   const styleCover: CSSProperties = {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      border: "none",
   }

   const points = useMemo(() => generatePointsInterleaved(edges + 1, dimension), [edges, dimension])

   return (
      <HBox>
         <VBox>
            <HBox>
               <Button onClick={(x, y) => setPicker({ show: true, x, y })}>
                  <p style={styleColor}>Color</p>
               </Button>
               {picker.show ? (
                  <Popover x={picker.x} y={picker.y}>
                     <Button style={styleCover} onClick={(x, y) => setPicker({ show: false, x, y })}></Button>
                     <SketchPicker color={color1} onChange={c => setColor1(c.hex)} />
                  </Popover>
               ) : undefined}
               <Body />
            </HBox>
            <HBox>
               <VBox>
                  <HBox>
                     <Button onClick={() => setEdges(Math.min(edges + 1, 10))}>▲</Button>
                     <Button onClick={() => setEdges(Math.max(edges - 1, 1))}>▼</Button>
                     <p>Edges: {edges}</p>
                     <Body />
                  </HBox>
                  <HBox>
                     <Button onClick={() => setDimension(Math.min(dimension + 1, 5))}>▲</Button>
                     <Button onClick={() => setDimension(Math.max(dimension - 1, 1))}>▼</Button>
                     <p>Dimension: {dimension}</p>
                     <Body />
                  </HBox>
                  <HBox>
                     <Button onClick={() => setWidth(Math.min(width + 0.1, 1))}>▲</Button>
                     <Button onClick={() => setWidth(Math.max(width - 0.1, 0.1))}>▼</Button>
                     <p>Width: {width.toFixed(1)}</p>
                     <Body />
                  </HBox>
               </VBox>
               <VBox>
                  {false && (
                     <HBox>
                        <input type="checkbox" checked={checked} onClick={() => setChecked(!checked)} />
                        <label>2nd</label>
                     </HBox>
                  )}
               </VBox>
            </HBox>
         </VBox>
         <Body />
         <ThreeCanvas scale={4} width={"600px"} height={"200px"}>
            <Wideline
               points={points}
               attr={{
                  color: color1,
                  width: width ?? 0.2,
               }}
               join={"Miter"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
         </ThreeCanvas>
      </HBox>
   )
}

function ThreeCanvas(props: {
   width?: number | string
   height?: number | string
   scale?: number
   children?: ReactNode
}) {
   const width = props.width ?? "400px"
   const height = props.height ?? width
   return (
      <Canvas
         style={{
            backgroundColor: "#000000",
            width: width,
            height: height,
         }}
      >
         <group scale={[props.scale ?? 1, props.scale ?? 1, props.scale ?? 1]}>{props.children}</group>
      </Canvas>
   )
}

function Popover(props: { x?: number; y?: number; children?: ReactNode }) {
   return (
      <div
         style={{
            position: "absolute",
            left: props.x ?? 0,
            top: props.y ?? 0,
            zIndex: 2,
         }}
      >
         {props.children}
      </div>
   )
}

function Body(props: { children?: ReactNode }) {
   return (
      <div
         style={{
            flex: 1,
         }}
      >
         {props.children}
      </div>
   )
}

function Border() {
   return (
      <div
         style={{
            flex: 1,
            backgroundColor: "gray",
            padding: "1px",
            margin: "6px",
         }}
      ></div>
   )
}

function HBox(props: { children?: ReactNode }) {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "row",
            //padding: "4px",
            alignItems: "center",
            justifyContent: "center",
            // border: "1px solid red",
         }}
      >
         {props.children}
      </div>
   )
}

function VBox(props: { children?: ReactNode }) {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            //padding: "4px",
            alignItems: "left",
            justifyContent: "center",
         }}
      >
         {props.children}
      </div>
   )
}

function Button(props: {
   style?: React.CSSProperties
   children?: ReactNode
   onClick?: (x: number, y: number) => void
}) {
   const style: CSSProperties = {
      fontSize: "larger",
      margin: "4px",
      padding: "4px",
      borderRadius: "4px",
      border: "2px solid black",
   }
   return (
      <div
         style={{ ...style, ...props.style }}
         onClick={e => {
            props.onClick?.(e.pageX, e.pageY)
         }}
      >
         {props.children}
      </div>
   )
}

export function Main() {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
         }}
      >
         <HBox>
            <img src={svglogo} className="App-logo" />
            <Body />
            <h1>Three-Wideline drawn itself</h1>
            <Body />
         </HBox>
         <Border />
         <HBox>
            <h3>Wideline Logo</h3>
            <Body />
            <ThreeCanvas scale={5} width={"200px"}>
               <Logo />
            </ThreeCanvas>
         </HBox>
         <Border />
         <Sample1 />
         <Border />
         <Sample2 />
         <Border />
      </div>
   )
}
