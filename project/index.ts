import {
  button,
  Children,
  container,
  defineComponent,
  div,
  forceUpdateEofol,
  generateId,
  h1,
  registerSw,
  renderEofol,
} from "../src"

const eButton = (children: Children, onclick: () => void) =>
  button(
    children,
    {
      onclick,
    },
    {
      style:
        "height: 40px; padding: 0 16px; background-color: darkmagenta; color: lightgrey; border: 2px solid black; cursor: pointer; font-weight: 500;",
    },
  )

const rand = defineComponent("rand", {
  state: { id: generateId() },
  render: (state, setState) =>
    div(
      [
        // @ts-ignore
        div(`Render id: ${state.id}`),
        eButton("Refresh", () => {
          setState({ id: generateId() })
          console.log("Set state!")
        }),
      ],
      { style: "display: flex; flex-direction: column; justify-content: center; gap: 16px; width: 256px;" },
    ),
})

const counter = defineComponent("counter", {
  state: { count: 0 },
  render: (state, setState) =>
    div(
      [
        // @ts-ignore
        div(`Clicked ${state.count} times`),
        eButton("Click", () => {
          // @ts-ignore
          setState({ count: state.count + 1 })
        }),
        eButton("Clear", () => {
          setState({ count: 0 })
        }),
      ],
      { style: "display: flex; flex-direction: column; justify-content: center; gap: 8px; margin-top: 32px;" },
    ),
})

const propsTest = defineComponent("propsTest", { render: (_state, _setState, props) => div(props.arg) })

renderEofol(
  "root",
  container([
    h1("Eofol6"),
    rand(),
    eButton("Force update", () => {
      forceUpdateEofol()
      console.log("Force update!")
    }),
    counter(),
    propsTest({ arg: 1 }),
    propsTest({ arg: 2 }),
  ]),
)

registerSw()
