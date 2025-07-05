import { getDef } from "./internal"
import { getArgs, Lifecycle } from "./lifecycle"
import { isString, mapCombinator } from "../util"
import { VDOMItem } from "../types"

const renderPrevdomToVdom = (prevdom: VDOMItem) => {
  if (prevdom?.type === "custom") {
    const def = getDef(prevdom.tag)
    if (def) {
      const args = getArgs({ vdom: prevdom, def })
      return traversePreVdom(Lifecycle.render({ def, args }))
    }
  } else {
    return prevdom
  }
}
export const traversePreVdom = (prevdom: undefined | false | string | { render: () => VDOMItem; key: string }) => {
  if (prevdom === undefined || prevdom === false) {
    return undefined
  } else if (isString(prevdom)) {
    return prevdom
  } else {
    const rendered = prevdom.render()
    const def = getDef(rendered.tag)
    if (def) {
      // @TODO place after update dom
      const args = getArgs({ vdom: rendered, def })
      Lifecycle.afterRender({ def, args })
    }
    const visited = renderPrevdomToVdom(rendered)
    if (visited !== undefined && !isString(visited) && rendered?.type !== "custom") {
      visited.children = mapCombinator(rendered.children, traversePreVdom)
    }
    return visited
  }
}
