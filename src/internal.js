import { e } from "./create-element"

const internal = { instances: {}, vdom: [], defs: {} }

export const getVdom = () => internal.vdom
export const setVdom = (next) => {
  internal.vdom = next
}

export const getInstances = () => internal.instances
export const getInstance = (id) => internal.instances[id]

export const setInstances = (next) => {
  internal.instances = next
}
export const setInstance = (id, next) => {
  internal.instances[id] = next
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
