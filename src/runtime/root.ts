import { arrayCombinator, domClearChildren } from "../util"
import { getVdom, renderVdom, setVdom } from "../core"
import { VDOMItem } from "../types"

let rootInternal: HTMLElement | null

const getRoot = () => rootInternal

const setRoot = (rootId: string) => {
  rootInternal = document.getElementById(rootId)
  return rootInternal
}

const renderEofolInternal = () => {
  const root = getRoot()
  arrayCombinator(renderVdom(getVdom()), (item) => {
    root?.appendChild(item)
  })
}

export const forceUpdateEofol = () => {
  const root = getRoot()
  if (root) {
    domClearChildren(root)
    renderEofolInternal()
  }
}

export const renderEofol = (rootId: string, vdom: VDOMItem) => {
  const root = setRoot(rootId)
  if (root) {
    setVdom(vdom)
    renderEofolInternal()
  }
}
