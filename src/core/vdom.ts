import { VDOMItem } from "../types"
import { getDef } from "./internal"
import { logEofolError } from "../eofol-util"
import { arrayCombinator, mapCombinator } from "../util"
import { getArgs, Lifecycle } from "./lifecycle"

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

const renderCustomDom = (vdom: VDOMItem) => {
  const def = getDef(vdom.tag)
  if (def) {
    const args = getArgs({ vdom, def })
    const lifecycleArgs = { def, args }
    if (Lifecycle.shouldRender(lifecycleArgs)) {
      // @TODO vdom with custom components VS vdom only 1-1 with dom elements
      const nextVdom = Lifecycle.render(lifecycleArgs)
      return renderVdomToDom(nextVdom)
    } else {
      return vdom
    }
  } else {
    logEofolError(`Def "${vdom.tag}" not found.`)
  }
}

const renderDom = (vdom: VDOMItem) => {
  if (vdom === undefined) {
    return ""
  } else if (typeof vdom === "string") {
    return vdom
  }
  if (vdom.type === "custom") {
    return renderCustomDom(vdom)
  } else {
    return renderTagDom(vdom)
  }
}

const mountDom = (result, renderedChild) => {
  if (typeof renderedChild === "string") {
    result.innerHTML = renderedChild
  } else if (renderedChild !== undefined) {
    result.appendChild(renderedChild)
  }
}

export const updateDomChildren = (result, vdom: VDOMItem) => {
  arrayCombinator(vdom.children, (child) => {
    if (child) {
      const renderedChild = renderVdomToDom(child)
      // @TODO process instead as a tree in two steps prevdom -> vdom -> dom
      mountDom(result, renderedChild)
    }
    if (typeof child !== "string" && child && child?.type === "custom") {
      const def = getDef(child.tag)
      if (def) {
        const args = getArgs({ vdom: child, def })
        Lifecycle.afterRender({ def, args })
      }
    }
  })
  return result
}

export const renderVdomToDom = (vdom: VDOMItem) => {
  const result = renderDom(vdom)
  updateDomChildren(result, vdom)
  return result
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
    const visited = renderPrevdomToVdom(prevdom)
    if (visited !== undefined && typeof visited !== "string" && prevdom?.type !== "custom") {
      visited.children = mapCombinator(prevdom.children, (child) => {
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
