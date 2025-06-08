import {
  Attributes,
  button,
  Children,
  container,
  cx,
  defineComponent,
  div,
  forceUpdateEofol,
  h1,
  registerSw,
  renderEofol,
} from "../src"

const getRandomStringImpl = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

const getRandomString = getRandomStringImpl(17)

const col = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("col center", attributes?.class) })
const row = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("row", attributes?.class) })
const center = (children?: Children, attributes?: Attributes) =>
  div(children, { ...(attributes ?? {}), class: cx("center", attributes?.class) })

const eContainer = (children?: Children) => col(children, { class: "e-container" })
const eButton = (children: Children, onclick: () => void) =>
  button(
    children,
    {
      onclick,
    },
    {
      class: "e-button",
    },
  )

const rand = defineComponent("rand", {
  state: { id: getRandomString() },
  render: (state, setState) =>
    eContainer([
      // @ts-ignore
      center(`Render id: ${state.id}`),
      eButton("Refresh", () => {
        setState({ id: getRandomString() })
        console.log("Set state!")
      }),
      eButton("Force update", () => {
        forceUpdateEofol()
        console.log("Force update!")
      }),
    ]),
})

const counter = defineComponent("counter", {
  state: { count: 0 },
  render: (state, setState) =>
    eContainer([
      // @ts-ignore
      center(`Clicked ${state.count} times`),
      eButton("Click", () => {
        // @ts-ignore
        setState({ count: state.count + 1 })
      }),
      eButton("Clear", () => {
        setState({ count: 0 })
      }),
    ]),
})

const propsTest = defineComponent("propsTest", {
  render: (_state, _setState, props) => center(`${props.label} prop value: ${props.arg}`),
})

const propsTestContainer = defineComponent("propsTestContainer", {
  state: { first: 0, second: 0 },
  render: (state, setState) =>
    eContainer([
      // @ts-ignore
      propsTest({ arg: state.first, label: "First" }),
      eButton("Increment first", () => {
        // @ts-ignore
        setState({ ...state, first: state.first + 1 })
      }),
      // @ts-ignore
      propsTest({ arg: state.second, label: "Second" }),
      eButton("Increment second", () => {
        // @ts-ignore
        setState({ ...state, second: state.second + 1 })
      }),
    ]),
})

renderEofol("root", container([h1("Eofol6"), rand(), counter(), propsTestContainer()]))

registerSw()
