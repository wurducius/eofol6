import { Attributes, Children, Properties, Props } from "../types"
import { generateId } from "../util"

export const createElement = (
  tag: string,
  attributes?: Attributes,
  children?: Children,
  properties?: Properties,
  type?: string,
) => {
  const key = generateId()
  return {
    render: () => ({
      tag,
      props: type === "custom" ? attributes : {},
      children: typeof children === "object" || Array.isArray(children) ? children : children?.toString(),
      attributes,
      properties,
      key,
      type,
    }),
    key,
  }
}

export const e = (elementName: string, props?: Props) =>
  createElement(elementName, props ?? {}, undefined, {}, "custom")
