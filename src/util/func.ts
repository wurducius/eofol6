export function arrayCombinator<T>(
  items: T | T[] | undefined,
  // eslint-disable-next-line no-unused-vars
  handler: (_next: T, _index: number | undefined) => void,
) {
  if (Array.isArray(items)) {
    items.forEach((item, index) => {
      handler(item, index)
    })
  } else if (items) {
    handler(items, undefined)
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
