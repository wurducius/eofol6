import { getDef, getInstance, setInstance } from "./internal"
import { arrayCombinator } from "./util"
import { logEofolError } from "./log"
import { forceUpdateEofol } from "./root"
import { State, VDOMItem } from "./types"

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
    const instance = getInstance(vdom.key)
    let state
    if (instance) {
      state = instance.state
    } else {
      const initialState = { ...def.state }
      const nextInstance = { state: initialState }
      setInstance(vdom.key, nextInstance)
      state = initialState
    }
    const setState = (nextState: State) => {
      const oldInstance = getInstance(vdom.key)
      const next = { ...oldInstance, state: nextState }
      setInstance(vdom.key, next)
      forceUpdateEofol()
    }
    const renderedVdom = def.render(state ?? {}, setState)
    return renderVdom(renderedVdom)
  } else {
    logEofolError(`Def "${vdom.tag}" not found.`)
  }
}

const renderDom = (vdom: VDOMItem) => {
  if (vdom.type === "custom") {
    return renderCustomDom(vdom)
  } else {
    return renderTagDom(vdom)
  }
}

const renderVdomImpl = (rendered: HTMLElement, vdom: VDOMItem) => {
  const renderedChild = renderVdom(vdom)
  if (typeof renderedChild === "string") {
    rendered.innerHTML = renderedChild
  } else {
    rendered.appendChild(renderedChild)
  }
}

export const renderVdom = (vdom: VDOMItem) => {
  if (vdom === undefined) {
    return ""
  } else if (typeof vdom === "string") {
    return vdom
  }
  const rendered = renderDom(vdom)
  arrayCombinator(vdom.children, (child) => {
    renderVdomImpl(rendered, child)
  })
  return rendered
}
