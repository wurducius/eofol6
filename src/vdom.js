const renderComponentDom = (vdom) => {
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
  const rendered = renderComponentDom(vdom)
  if (vdom.children && Array.isArray(vdom.children) && vdom.children.length > 0) {
    vdom.children.forEach((child) => {
      renderVdomImpl(rendered, child)
    })
  } else {
    renderVdomImpl(rendered, vdom.children)
  }
  return rendered
}
