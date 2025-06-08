import { generateId } from "./util"

export const createElement = (tag, attributes, children, properties, type) => ({
  tag,
  props: {},
  children,
  attributes,
  properties,
  key: generateId(),
  type,
})

export const div = (children, attributes) => createElement("div", attributes, children)

export const h1 = (children) => createElement("h1", undefined, children)

export const container = (children) =>
  createElement(
    "div",
    {
      style: "display: flex; flex-direction: column; align-items: center; padding: 36px 36px;",
    },
    children,
  )

export const button = (children, properties, attributes) => createElement("button", attributes, children, properties)

export const e = (elementName) => createElement(elementName, {}, undefined, {}, "custom")
