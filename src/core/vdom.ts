import { arrayCombinator, isString, mapCombinator } from "../util"
import { VDOMItem } from "../types"
import { getArgs } from "./lifecycle"
import { getDef } from "./internal"

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
    let visited
    if (vdom.type === "custom") {
      const def = getDef(vdom.tag)
      const args = getArgs({ def, vdom })
      visited = traverseVdom(def.render(args).render())
    } else {
      visited = renderTagDom(vdom)
    }
    if (visited && vdom?.children) {
      arrayCombinator(vdom.children, (child) => {
        const visitedChild = traverseVdom(child?.render ? child.render() : child)
        appendToDom(visited, visitedChild)
      })
    }
    return visited
  }
}

export const traversePreVdom = (prevdom: undefined | false | string | { render: () => VDOMItem; key: string }) => {
  if (prevdom === undefined || prevdom === false) {
    return undefined
  } else if (isString(prevdom)) {
    return prevdom
  } else {
    const rendered = prevdom.render()
    // @TODO place after update dom
    //     const args = getArgs({ vdom: rendered, def })
    //     Lifecycle.afterRender({ def, args })
    //   }
    if (rendered !== undefined && !isString(rendered) && Array.isArray(rendered.children)) {
      rendered.children = mapCombinator(rendered.children, traversePreVdom)
    }
    return rendered
  }
}
