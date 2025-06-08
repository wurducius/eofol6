import { e } from "./create-element"

const internal = { instances: [], vdom: [], defs: {} }

export const getVdom = () => internal.vdom
export const setVdom = (next) => {
  internal.vdom = next
}

export const getInstances = () => internal.instances
export const setInstances = (next) => {
  internal.instances = next
}

export const getDefs = () => internal.defs
export const getDef = (defName) => internal.defs[defName]
export const addDef = (defName, defArgs) => {
  internal.defs[defName] = defArgs
}

export const defineComponent = (componentName, componentArgs) => {
  addDef(componentName, componentArgs)
  return () => {
    return e(componentName)
  }
}
