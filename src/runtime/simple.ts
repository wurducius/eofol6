import { Attributes, Children, Properties } from "../types"
import { createElement } from "../core"

export const div = (children: Children, attributes?: Attributes) => createElement("div", attributes, children)

export const h1 = (children: Children) => createElement("h1", undefined, children)

export const container = (children: Children) =>
  createElement(
    "div",
    {
      class: "col container",
    },
    children,
  )

export const button = (children: Children, properties: Properties, attributes: Attributes) =>
  createElement("button", attributes, children, properties)
