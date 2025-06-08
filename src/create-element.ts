import { generateId } from "./util"
import { Attributes, Children, Properties } from "./types"

export const createElement = (
  tag: string,
  attributes?: Attributes,
  children?: Children,
  properties?: Properties,
  type?: string,
) => ({
  tag,
  props: {},
  children,
  attributes,
  properties,
  key: generateId(),
  type,
})

export const e = (elementName: string) => createElement(elementName, {}, undefined, {}, "custom")
