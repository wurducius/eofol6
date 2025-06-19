import { getDef } from "./internal"
import { arrayCombinator, mapCombinator } from "../util"
import { getArgs, Lifecycle } from "./lifecycle"
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

const renderPrevdomToVdom = (prevdom) => {
  if (prevdom?.type === "custom") {
    const def = getDef(prevdom.tag)
    if (def) {
      const args = getArgs({ vdom: prevdom, def })
      const lifecycleArgs = { def, args }
      return traversePreVdom(Lifecycle.render(lifecycleArgs))
    }
  } else {
    return prevdom
  }
}

export const traversePreVdom = (prevdom) => {
  if (prevdom === undefined || prevdom === false) {
    return undefined
  } else if (typeof prevdom === "string") {
    return prevdom
  } else {
    const rendered = prevdom.render()
    const def = getDef(rendered.tag)
    if (def) {
      // @TODO place after update dom
      const args = getArgs({ vdom: rendered, def })
      Lifecycle.afterRender({ def, args })
    }
    const visited = renderPrevdomToVdom(rendered)
    if (visited !== undefined && typeof visited !== "string" && rendered?.type !== "custom") {
      visited.children = mapCombinator(rendered.children, (child) => {
        return traversePreVdom(child)
      })
    }
    return visited
  }
}

export const traverseVdom = (vdom) => {
  if (vdom === undefined || vdom === false) {
    return undefined
  } else if (typeof vdom === "string") {
    return vdom
  } else {
    const visited = renderTagDom(vdom)
    if (visited && vdom?.children) {
      arrayCombinator(vdom.children, (child) => {
        const visitedChild = traverseVdom(child)
        if (typeof visitedChild === "string") {
          visited.innerHTML = visitedChild
        } else if (visitedChild !== undefined) {
          visited.appendChild(visitedChild)
        }
      })
    }
    return visited
  }
}
