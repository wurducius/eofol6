import { Attributes, Children } from "../src"
import { cx, col, button } from "eofol-runtime"

export const eContainer = (children?: Children, className?: string) =>
  col(children, { class: cx("e-container", className) })

export const eButton = (children: Children, onclick: () => void, attributes?: Attributes) =>
  button(
    children,
    {
      onclick,
    },
    {
      class: "e-button",
      ...(attributes ?? {}),
    },
  )
