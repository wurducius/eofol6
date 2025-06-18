import { Attributes, button, Children, col, cx } from "../src"

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
