// eslint-disable-next-line no-unused-vars
export function arrayCombinator<T>(items: T | T[] | undefined, handler: (_next: T) => void) {
  if (Array.isArray(items)) {
    items.forEach((item) => {
      handler(item)
    })
  } else if (items) {
    handler(items)
  }
}
