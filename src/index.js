import { forceUpdateEofol, renderEofol } from "./root"
import { button, div } from "./create-element"

renderEofol(
  div([
    div([div(["TRADAAAA", div("UUUUU"), div(undefined)])]),
    button("Refresh", {
      onclick: () => {
        forceUpdateEofol()
        console.log("Force update!")
      },
    }),
  ]),
)
