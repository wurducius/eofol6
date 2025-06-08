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

export const e = (elementName) => createElement(elementName, {}, undefined, {}, "custom")
