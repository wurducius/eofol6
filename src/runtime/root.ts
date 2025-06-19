import { arrayCombinator, domClearChildren, profilerEnd, profilerStart } from "../util"
import { appendToDom, getVdom, setVdom, traversePreVdom, traverseVdom } from "../core"
import { VDOMItem } from "../types"
import { initEofol } from "./init"

let rootInternal: HTMLElement | null

const getRoot = () => rootInternal

const setRoot = (rootId: string) => {
  rootInternal = document.getElementById(rootId)
  return rootInternal
}

const renderEofolInternal = () => {
  const root = getRoot()
  const dom = traverseVdom(traversePreVdom(getVdom()))
  if (root) {
    arrayCombinator(dom, (item) => {
      appendToDom(root, item)
    })
  }
}

export const forceUpdateEofol = () => {
  profilerStart("forceUpdate")
  const root = getRoot()
  if (root) {
    domClearChildren(root)
    renderEofolInternal()
  }
  profilerEnd("forceUpdate", "Force update")
}

export const updateEofol = () => {
  profilerStart("update")
  const root = getRoot()
  if (root) {
    domClearChildren(root)
    renderEofolInternal()
  }
  profilerEnd("update", "Update")
}

export const mountEofol = (rootId: string, vdom: () => VDOMItem) => {
  profilerStart("mount")
  const root = setRoot(rootId)
  if (root) {
    setVdom(vdom)
    renderEofolInternal()
    initEofol()
  }
  profilerEnd("mount", "Mount")
}
