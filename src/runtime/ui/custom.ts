import { createElement } from "../../core"
import { Attributes, Children } from "../../types"
import { div } from "./simple"
import { cx } from "../../util"

export const container = (children: Children) =>
  createElement(
    "div",
    {
      class: "col container",
    },
    children,
  )

export const col = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("col center", attributes?.class) })

export const row = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("row", attributes?.class) })
export const center = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("center", attributes?.class) })
