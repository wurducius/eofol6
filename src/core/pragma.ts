import { createElement } from "./create-element"
import { Attributes, Props, VDOMItem } from "../types"
import { getDef } from "./internal"

export const j = (
  tagName: string,
  attributes: Attributes | Props,
  ...children: Array<VDOMItem | undefined | string>
) => {
  const def = getDef(tagName)
  return createElement(tagName, attributes, children, {}, def ? "custom" : undefined)
}
