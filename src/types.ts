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

// eslint-disable-next-line no-unused-vars
export type DefArgs = {
  render: (_state: State, setState: (_next: State) => void, _props: Props) => EofolNode
  state?: State
}

export type Internal = { instances: Record<string, Instance>; vdom: VDOMItem; defs: Record<string, DefArgs> }
