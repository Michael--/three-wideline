import { ReactNode, CSSProperties } from "react"

export function Popover(props: { x?: number; y?: number; children?: ReactNode }) {
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

export function Flex(props: { children?: ReactNode }) {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
         }}
      >
         {props.children}
      </div>
   )
}

export function Body(props: { style?: React.CSSProperties; children?: ReactNode }) {
   return <div style={{ flex: 1, ...props.style }}>{props.children}</div>
}

export function Border() {
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

export function HBox(props: { children?: ReactNode }) {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
         }}
      >
         {props.children}
      </div>
   )
}

export function VBox(props: { children?: ReactNode }) {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
         }}
      >
         {props.children}
      </div>
   )
}

export function Button(props: {
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

export function Checkbox(props: {
   checked: boolean
   style?: React.CSSProperties
   children?: ReactNode
   onChange?: (checked: boolean) => void
}) {
   return (
      <HBox>
         <input
            style={props.style}
            type="checkbox"
            checked={props.checked}
            onClick={() => props.onChange?.(!props.checked)}
            onChange={() => null}
         />
         {props.children}
      </HBox>
   )
}
