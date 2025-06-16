export type EofolNode = VDOMItem | string | undefined | null | false

export type Children = EofolNode | EofolNode[]

export type Attributes = Record<string, string>

export type Properties = Record<string, any>

export type Props = Record<string, any>

export type VDOMItem = {
  key: string
  tag: string
  type?: string
  children: Children
  attributes?: Attributes
  properties?: Properties
}

export type State = object

export type Instance = { state?: State; props?: Props }

export type EffectArgs = {
  state: State
  // eslint-disable-next-line no-unused-vars
  setState: (_next: State) => void
  // eslint-disable-next-line no-unused-vars
  mergeState: (_next: Partial<State>) => void
  resetState: () => void
  initialState: State
  props: Props
}

// eslint-disable-next-line no-unused-vars
export type Effect = ((args: EffectArgs) => (args: EffectArgs) => void) | ((args: EffectArgs) => void)

export type Args = {
  state: State
  // eslint-disable-next-line no-unused-vars
  setState: (_next: State) => void
  // eslint-disable-next-line no-unused-vars
  mergeState: (_next: Partial<State>) => void
  resetState: () => void
  initialState: State
  props: Props
}

export type DefArgs = {
  // eslint-disable-next-line no-unused-vars
  render: (args: Args) => EofolNode
  state?: State
  // eslint-disable-next-line no-unused-vars
  shouldUpdate?: (args: { state: State; props: Props }) => boolean
  subscribe?: string[] | string
  defaultProps?: Props
  effect?: Effect | Effect[]
}

export type Internal = { instances: Record<string, Instance>; vdom: VDOMItem; defs: Record<string, DefArgs> }

export type LifecycleArgs = { args: Args; def: DefArgs }

export type Store = { data: object; initial: object; projections: Record<string, Function> }
