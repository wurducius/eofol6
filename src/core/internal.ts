import { DefArgs, Instance, Internal, Props, VDOMItem } from "../types"
import { e } from "./create-element"

const internal: Internal = {
  instances: {},
  vdom: () => ({
    key: "initial",
    tag: "div",
    children: undefined,
  }),
  defs: {},
}

export const getVdom = () => internal.vdom
export const setVdom = (next: () => VDOMItem) => {
  internal.vdom = next
}

export const getInstances = () => internal.instances
export const getInstance = (id: string) => internal.instances[id]
export const setInstances = (next: Record<string, Instance>) => {
  internal.instances = next
}
export const setInstance = (id: string, next: Instance) => {
  internal.instances[id] = next
}

export const getDefs = () => internal.defs
export const getDef = (defName: string) => internal.defs[defName]
export const addDef = (defName: string, defArgs: DefArgs) => {
  internal.defs[defName] = defArgs
}

export const define = (componentName: string, componentArgs: DefArgs) => {
  addDef(componentName, componentArgs)
  return (props?: Props) => {
    return e(componentName, props)
  }
}
