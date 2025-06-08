export const arrayCombinator = (items, handler) => {
  if (Array.isArray(items)) {
    items.forEach((item) => {
      handler(item)
    })
  } else if (items) {
    handler(items)
  }
}
