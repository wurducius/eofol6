export const LOADING = "LOADING"

export type Stateful<T> = undefined | typeof LOADING | T

export type FetchArgs = {
  url: string
  method?: string
  payload?: any
}

export function isLoading<T>(next: Stateful<T>): next is typeof LOADING {
  return next === LOADING
}

export function hasData<T>(next: Stateful<T>): next is T {
  return next !== undefined && !isLoading(next)
}

export function getData<T>(next: Stateful<T>) {
  return hasData(next) ? next : undefined
}

// eslint-disable-next-line no-unused-vars
export const fetchX = (args: FetchArgs, handler: (next: any) => void) =>
  fetch(args.url, {
    method: args.method ?? "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(args.payload),
  })
    .then((res) => res.json())
    .then((data) => {
      handler(data)
    })
    .catch((ex) => {
      console.log(ex)
    })

// eslint-disable-next-line no-unused-vars
export const useReq = (args: FetchArgs, value: any, setter: (next: any) => void, parser: (next: any) => any) => {
  console.log(value)
  if (value === undefined) {
    setter(LOADING)
    fetchX(args, (x) => {
      setter(parser(x))
    })
  }
}
