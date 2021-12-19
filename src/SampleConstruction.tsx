import { useMemo, useState, CSSProperties } from "react"
import { Wideline } from "./Wideline"
import { generatePointsInterleaved } from "./Wideline"
import { SketchPicker } from "react-color"
import { Popover, HBox, VBox, Body, Button } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleConstruction() {
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
