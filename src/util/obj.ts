export const mergeDeep = (...objects: Record<string, any>[]) => {
  const isObject = (obj: object) => obj && typeof obj === "object"
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]
      const oVal = obj[key]
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = oVal ?? pVal
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })
    return prev
  }, {})
}

export const ax = (fields: Record<string, any>, initial?: Object) =>
  Object.keys(fields).reduce((acc, next) => {
    const value = fields[next]
    if (value !== undefined) {
      // @ts-ignore
      acc[next] = value
    }
    return acc
  }, initial ?? {})

export const deepCompare = (x: object, y: object) => {
  if (x === y) return true
  if (!(x instanceof Object) || !(y instanceof Object)) return false
  if (x.constructor !== y.constructor) return false
  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue
    if (!y.hasOwnProperty(p)) return false
    if (x[p] === y[p]) continue
    if (typeof x[p] !== "object") return false
    if (!deepCompare(x[p], y[p])) return false
  }
  for (p in y) if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false
  return true
}

export const isEmpty = (obj: object) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false
    }
  }
  return true
}
