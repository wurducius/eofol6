const internal = { instances: [], vdom: [] }

export const getVdom = () => internal.vdom
export const setVdom = (next) => {
  internal.vdom = next
}

export const getInstances = () => internal.instances
export const setInstances = (next) => {
  internal.instances = next
}
