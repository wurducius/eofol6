import { Attributes, button, Children, col } from "../src"

export const eContainer = (children?: Children) => col(children, { class: "e-container" })

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
