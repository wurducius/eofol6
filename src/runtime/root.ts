import { arrayCombinator, domClearChildren, profilerEnd, profilerStart } from "../util"
import { appendToDom, getVdom, setVdom, traversePreVdom, traverseVdom } from "../core"
import { RenderUpdateArgs, VDOMItem } from "../types"
import { initEofol } from "./init"

let rootInternal: HTMLElement | null

const getRoot = () => rootInternal

const setRoot = (rootId: string) => {
  rootInternal = document.getElementById(rootId)
  return rootInternal
}

// eslint-disable-next-line no-unused-vars
const renderEofolInternal = (args: RenderUpdateArgs) => {
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
    renderEofolInternal({ update: "forceUpdate" })
  }
  profilerEnd("forceUpdate", "Force update")
}

export const updateEofol = (args: RenderUpdateArgs) => {
  profilerStart("update")
  const root = getRoot()
  if (root) {
    domClearChildren(root)
    renderEofolInternal(args)
  }
  profilerEnd("update", "Update")
}

export const mountEofol = (rootId: string, vdom: () => VDOMItem) => {
  profilerStart("mount")
  const root = setRoot(rootId)
  if (root) {
    setVdom(vdom)
    renderEofolInternal({ update: "mount" })
    initEofol()
  }
  profilerEnd("mount", "Mount")
}
