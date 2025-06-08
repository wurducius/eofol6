import { State, VDOMItem } from "../types"
import { getDef, getInstance, setInstance } from "./internal"
import { updateEofol } from "../runtime"
import { logEofolError } from "../eofol-util"
import { arrayCombinator } from "../util"

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
    const oldInstance = getInstance(vdom.key)
    let currentInstance
    if (oldInstance) {
      currentInstance = oldInstance
    } else {
      const initialState = { ...def.state }
      const nextInstance = { state: initialState, props: vdom.attributes }
      setInstance(vdom.key, nextInstance)
      currentInstance = nextInstance
    }
    const state = currentInstance.state
    const setState = (nextState: State) => {
      const oldInstance = getInstance(vdom.key)
      const next = { ...oldInstance, state: nextState }
      setInstance(vdom.key, next)
      updateEofol()
    }
    const props = currentInstance.props
    const renderedVdom = def.render(state ?? {}, setState, props)
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
