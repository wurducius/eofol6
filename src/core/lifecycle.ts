import { Args, DefArgs, LifecycleArgs, State, VDOMItem } from "../types"
import { getInstance, setInstance } from "./internal"
import { updateEofol } from "../runtime"
import { arrayCombinator, mergeDeep } from "../util"

export const getArgs = (x: { def: DefArgs; vdom: VDOMItem }): Args => {
  const { def, vdom } = x
  const oldInstance = getInstance(vdom.key)
  let currentInstance
  if (oldInstance) {
    currentInstance = oldInstance
  } else {
    const initialState = { ...def.state }
    const nextInstance = { state: initialState, props: vdom.attributes }
    setInstance(vdom.key, nextInstance)
    currentInstance = nextInstance
  }
  const state = currentInstance.state ?? {}
  const setState = (nextState: State) => {
    const oldInstance = getInstance(vdom.key)
    const next = { ...oldInstance, state: nextState }
    setInstance(vdom.key, next)
    // @TODO update only this component
    updateEofol()
  }
  const mergeState = (next: Partial<State>) => {
    setState(mergeDeep(state ?? {}, next))
  }
  const resetState = () => {
    setState({ ...def.state })
  }
  const props = currentInstance.props
  const result: Args = {
    initialState: def.state ?? {},
    state,
    setState,
    mergeState,
    resetState,
    props: props ?? {},
  }
  if (vdom.children) {
    result.children = vdom.children
  }
  return result
}

export const Lifecycle = {
  shouldRender: (x: LifecycleArgs) => {
    const { def, args } = x
    if (def.shouldUpdate) {
      const { props, state } = args
      return def.shouldUpdate({ props, state })
    } else {
      return true
    }
  },
  render: (x: LifecycleArgs) => {
    const { def, args } = x
    return def.render(args)
  },
  afterRender: (x: LifecycleArgs) => {
    const { def, args } = x
    if (def.effect) {
      arrayCombinator(def.effect, (effectSingle) => {
        const cleanup = effectSingle(args)
        if (cleanup) {
          cleanup(args)
        }
      })
    }
  },
}
