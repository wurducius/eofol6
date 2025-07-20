import { arrayCombinator, domClearChildren, profilerEnd, profilerStart } from "../util"
import { appendToDom, getDefs, getPrevdom, getVdom, setPrevdom, setVdom, traversePreVdom, traverseVdom } from "../core"
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
  const vdom = traversePreVdom(getPrevdom())
  const lastVdom = getVdom()
  const dom = traverseVdom(vdom, lastVdom)
  setVdom(vdom)
  if (root) {
    arrayCombinator(dom, (item) => {
      appendToDom(root, item)
    })
  }
}

const matchTree = (parent, matcher, callback) => {
  if (matcher(parent)) {
    callback(parent)
  } else {
    if (Array.isArray(parent.children) && parent.children.length > 0) {
      return parent.children.map((child) => matchTree(child, matcher, callback))
    }
  }
}

const renderEofolTargeted = (keys: string | string[]) => {
  arrayCombinator(keys, (key) => {
    const lastVdom = getVdom()
    const root = getRoot()
    matchTree(
      lastVdom,
      (vdom) => vdom.key === key,
      (found) => {
        const dom = traverseVdom(found, lastVdom)
        // setVdom(vdom)
        if (root) {
          arrayCombinator(dom, (item) => {
            appendToDom(root, item)
          })
        }
      },
    )
  })
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
    const isStoreUpdate = args.update === "store"
    if (isStoreUpdate) {
      const subscribe = args.subscribe
      const defs = getDefs()
      const subscribedDefKeys = Object.keys(defs).filter((defKey) => {
        const def = defs[defKey]
        return def.subscribe && (def.subscribe === subscribe || def.subscribe.includes(subscribe))
      })
      //  renderEofolTargeted(subscribedDefKeys)
    } else {
      const key = args.key
      //   renderEofolTargeted(key)
    }
    renderEofolInternal(args)
  }
  profilerEnd("update", "Update")
}

export const mountEofol = (rootId: string, vdom: () => VDOMItem) => {
  profilerStart("mount")
  const root = setRoot(rootId)
  if (root) {
    setPrevdom(vdom)
    renderEofolInternal({ update: "mount" })
    initEofol()
  }
  profilerEnd("mount", "Mount")
}
