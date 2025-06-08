import { forceUpdateEofol, renderEofol } from "./root"
import { button, container, div, h1 } from "./create-element"
import { generateId } from "./util"
import { defineComponent } from "./internal"

const rand = defineComponent("rand", {
  render: () =>
    div(
      [
        div(`Render id: ${generateId()}`),
        button(
          "Refresh",
          {
            onclick: () => {
              forceUpdateEofol()
              console.log("Force update!")
            },
          },
          {
            style:
              "height: 40px; padding: 0 16px; background-color: purple; color: black; border: 2px solid black; cursor: pointer;",
          },
        ),
      ],
      { style: "display: flex; flex-direction: column; justify-content: center; gap: 16px; width: 200px;" },
    ),
})

renderEofol(container([h1("Eofol6"), rand()]))
