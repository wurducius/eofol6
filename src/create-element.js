import { generateId } from "./util"

export const createElement = (tag, attributes, children, properties) => ({
  tag,
  props: {},
  children,
  attributes,
  properties,
  key: generateId(),
})

export const div = (children) => createElement("div", undefined, children)

export const button = (children, properties) => createElement("button", undefined, children, properties)
