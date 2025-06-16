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

// eslint-disable-next-line no-unused-vars
export function mapCombinator<T, V>(items: T | T[] | undefined, mapper: (_next: T) => V) {
  if (Array.isArray(items)) {
    return items.map(mapper)
  } else if (items) {
    return [mapper(items)]
  } else {
    return undefined
  }
}
