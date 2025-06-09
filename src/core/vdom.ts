import { VDOMItem } from "../types"
import { getDef } from "./internal"
import { logEofolError } from "../eofol-util"
import { arrayCombinator } from "../util"
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
      return renderVdomToDom(Lifecycle.render(lifecycleArgs))
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

const renderChild = (rendered: HTMLElement, vdom: VDOMItem) => {
  const renderedChild = renderVdomToDom(vdom)
  if (typeof renderedChild === "string") {
    rendered.innerHTML = renderedChild
  } else if (renderedChild !== undefined) {
    rendered.appendChild(renderedChild)
  }
}

export const updateDomChildren = (result, vdom: VDOMItem) => {
  arrayCombinator(vdom.children, (child) => {
    if (child) {
      renderChild(result, child)
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
