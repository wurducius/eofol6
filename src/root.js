import { renderVdom } from "./vdom"
import { arrayCombinator, domClearChildren } from "./util"
import { getVdom, setVdom } from "./internal"

let rootInternal

const getRoot = () => rootInternal

const setRoot = (rootId) => {
  rootInternal = document.getElementById(rootId)
  return rootInternal
}

const renderEofolInternal = () => {
  const root = getRoot()
  arrayCombinator(renderVdom(getVdom()), (item) => {
    root.appendChild(item)
  })
}

export const forceUpdateEofol = () => {
  const root = getRoot()
  domClearChildren(root)
  renderEofolInternal()
}

export const renderEofol = (rootId, vdom) => {
  const root = setRoot(rootId)
  if (root) {
    setVdom(vdom)
    renderEofolInternal()
  }
}
