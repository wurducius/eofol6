import { Attributes, Children, Properties } from "../../types"
import { createElement } from "../../core"

export const div = (children: Children, attributes?: Attributes) => createElement("div", attributes, children)
export const span = (children: Children, attributes?: Attributes) => createElement("span", attributes, children)
export const p = (children: Children, attributes?: Attributes) => createElement("p", attributes, children)
export const a = (children: Children, attributes?: Attributes) => createElement("a", attributes, children)

export const h1 = (children: Children) => createElement("h1", undefined, children)
export const h2 = (children: Children) => createElement("h2", undefined, children)
export const h3 = (children: Children) => createElement("h3", undefined, children)
export const h4 = (children: Children) => createElement("h4", undefined, children)
export const h5 = (children: Children) => createElement("h5", undefined, children)
export const h6 = (children: Children) => createElement("h6", undefined, children)

export const code = (children: Children, attributes?: Attributes) => createElement("code", attributes, children)
export const pre = (children: Children, attributes?: Attributes) => createElement("pre", attributes, children)

export const img = (properties: Properties, attributes: Attributes) =>
  createElement("img", attributes, undefined, properties)

export const button = (children: Children, properties: Properties, attributes: Attributes) =>
  createElement("button", attributes, children, properties)

export const input = (properties: Properties, attributes: Attributes) =>
  createElement("input", attributes, undefined, properties)

export const textarea = (properties: Properties, attributes: Attributes) =>
  createElement("textarea", attributes, undefined, properties)

export const select = (children: Children, properties: Properties, attributes: Attributes) =>
  createElement("select", attributes, children, properties)

export const option = (children: Children) => createElement("option", undefined, children)
