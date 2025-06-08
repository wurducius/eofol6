import { button, container, defineComponent, div, forceUpdateEofol, generateId, h1, renderEofol } from "../src"
import { Children } from "../src/types"

const eButton = (children: Children, onclick: () => void) =>
  button(
    children,
    {
      onclick,
    },
    {
      style:
        "height: 40px; padding: 0 16px; background-color: purple; color: darkgrey; border: 2px solid black; cursor: pointer; font-weight: 500;",
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

renderEofol(
  "root",
  container([
    h1("Eofol6"),
    rand(),
    eButton("Force update", () => {
      forceUpdateEofol()
      console.log("Force update!")
    }),
  ]),
)

const SERVICE_WORKER_FILENAME = "service-worker.js"

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(SERVICE_WORKER_FILENAME)
    .then((reg) => {
      console.log(`Registration succeeded. Scope is ${reg.scope}`)
      if (reg.installing) {
        console.log("Service worker installing")
      } else if (reg.waiting) {
        console.log("Service worker installed")
      } else if (reg.active) {
        console.log("Service worker active")
      }
    })
    .catch((error) => {
      console.log(`Registration failed with ${error}`)
    })
}
