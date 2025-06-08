import { getDef } from "./internal"
import { arrayCombinator } from "./util"

const renderTagDom = (vdom) => {
  const element = document.createElement(vdom.tag)
  element.setAttribute("key", vdom.key)
  if (vdom.attributes) {
    Object.keys(vdom.attributes).forEach((attributeName) => {
      element.setAttribute(attributeName, vdom.attributes[attributeName])
    })
  }
  if (vdom.properties) {
    Object.keys(vdom.properties).forEach((propertyName) => {
      element[propertyName] = vdom.properties[propertyName]
    })
  }
  return element
}

const renderCustomDom = (vdom) => {
  const def = getDef(vdom.tag)
  if (def) {
    const renderedVdom = def.render()
    const renderedDom = renderVdom(renderedVdom)
    return renderedDom
  } else {
    console.error('Def "' + vdom.tag + '" not found.')
  }
}

const renderDom = (vdom) => {
  if (vdom.type === "custom") {
    return renderCustomDom(vdom)
  } else {
    return renderTagDom(vdom)
  }
}

// const mount = () => {}

const renderVdomImpl = (rendered, vdom) => {
  const renderedChild = renderVdom(vdom)
  if (typeof renderedChild === "string") {
    rendered.innerHTML = renderedChild
  } else {
    rendered.appendChild(renderedChild)
  }
}

export const renderVdom = (vdom) => {
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
