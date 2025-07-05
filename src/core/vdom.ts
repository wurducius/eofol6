import { arrayCombinator, isString } from "../util"
import { VDOMItem } from "../types"

const renderTagDom = (vdom: VDOMItem) => {
  const element = document.createElement(vdom.tag)
  element.setAttribute("key", vdom.key)
  if (vdom.attributes) {
    Object.keys(vdom.attributes).forEach((attributeName) => {
      // @ts-ignore
      element.setAttribute(attributeName, vdom.attributes[attributeName])
    })
  }
  if (vdom.properties) {
    Object.keys(vdom.properties).forEach((propertyName) => {
      // @ts-ignore
      element[propertyName] = vdom.properties[propertyName]
    })
  }
  return element
}

export const appendToDom = (root, item) => {
  if (isString(item)) {
    if (root.innerHTML) {
      root.innerHTML = `${root.innerHTML}, ${item}`
    } else {
      root.innerHTML = item
    }
  } else if (item) {
    root?.appendChild(item)
  }
}

export const traverseVdom = (vdom) => {
  if (vdom === undefined || vdom === false) {
    return undefined
  } else if (isString(vdom)) {
    return vdom
  } else {
    const visited = renderTagDom(vdom)
    if (visited && vdom?.children) {
      arrayCombinator(vdom.children, (child) => {
        const visitedChild = traverseVdom(child)
        appendToDom(visited, visitedChild)
      })
    }
    return visited
  }
}
