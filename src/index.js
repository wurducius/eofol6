import { forceUpdateEofol, renderEofol } from "./root"
import { button, container, div, h1 } from "./create-element"
import { generateId } from "./util"
import { defineComponent } from "./internal"

const rand = defineComponent("rand", {
  render: () =>
    div([
      div(`Render id: ${generateId()}`),
      button("Refresh", {
        onclick: () => {
          forceUpdateEofol()
          console.log("Force update!")
        },
      }),
    ]),
})

renderEofol(container([h1("Eofol6"), rand()]))
