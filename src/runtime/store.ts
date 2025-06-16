import { mergeDeep } from "../util"
import { updateEofol } from "./root"
import { Store } from "../types"

const storeRegistry: Record<string, Store> = {}

export const createStore = (name: string, initial: object) => {
  storeRegistry[name] = { data: { ...initial }, initial, projections: {} }
}

export const selector = (name: string) => {
  const store = storeRegistry[name]
  if (store) {
    return store.data
  }
}

export const createProjection = (sourceName: string, projectionName: string, projectionMapping: Function) => {
  const store = storeRegistry[sourceName]
  if (store) {
    store.projections[projectionName] = projectionMapping
    createStore(projectionName, projectionMapping(store.data))
  }
}

export const setStoreImpl = (name: string, next: object) => {
  storeRegistry[name].data = next
  Object.keys(storeRegistry[name].projections).forEach((projectionName) => {
    const projectionMapping = storeRegistry[name].projections[projectionName]
    setStoreImpl(projectionName, projectionMapping(next))
  })
  // @TODO update only subscribed
  updateEofol()
}

export const resetStore = (name: string) => {
  const store = storeRegistry[name]
  if (store) {
    setStoreImpl(name, store.initial)
  }
}

export const setStore = (name: string, next: object) => {
  const store = storeRegistry[name]
  if (store) {
    setStoreImpl(name, next)
  }
}

export const mergeStore = (name: string, next: object) => {
  const store = storeRegistry[name]
  if (store) {
    setStoreImpl(name, mergeDeep(store.data, next))
  }
}
