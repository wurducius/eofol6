import { createElement } from "./create-element"
import { Attributes, Children, Properties } from "./types"

export const div = (children: Children, attributes?: Attributes) => createElement("div", attributes, children)

export const h1 = (children: Children) => createElement("h1", undefined, children)

export const container = (children: Children) =>
  createElement(
    "div",
    {
      style: "display: flex; flex-direction: column; align-items: center; padding: 36px 36px;",
    },
    children,
  )

export const button = (children: Children, properties: Properties, attributes: Attributes) =>
  createElement("button", attributes, children, properties)
