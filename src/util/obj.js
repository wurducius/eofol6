export const mergeDeep = (...objects) => {
  const isObject = (obj) => obj && typeof obj === "object"
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

export const ax = (fields, initial) =>
  Object.keys(fields).reduce((acc, next) => {
    const value = fields[next]
    if (value !== undefined) {
      // @ts-ignore
      acc[next] = value
    }
    return acc
  }, initial ?? {})
