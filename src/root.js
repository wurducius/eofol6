import { renderVdom } from "./vdom"
import { arrayCombinator, domClearChildren } from "./util"
import { getVdom, setVdom } from "./internal"

const root = document.getElementById("root")

const renderEofolInternal = () => {
  arrayCombinator(renderVdom(getVdom()), (item) => {
    root.appendChild(item)
  })
}

export const forceUpdateEofol = () => {
  domClearChildren(root)
  renderEofolInternal()
}

export const renderEofol = (vdom) => {
  if (root) {
    setVdom(vdom)
    renderEofolInternal()
  }
}
