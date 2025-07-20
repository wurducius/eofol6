import { arrayCombinator, isString, mapCombinator } from "../util"
import { VDOMItem } from "../types"
import { getArgs, Lifecycle } from "./lifecycle"
import { getDef } from "./internal"

const renderTagDom = (vdom: VDOMItem) => {
  const element = document.createElement(vdom.tag)
  element.setAttribute("key", vdom.key)
  if (vdom.attributes) {
    Object.keys(vdom.attributes).forEach((attributeName) => {
      // @ts-ignore
      element.setAttribute(attributeName, vdom.attributes[attributeName])
    })
  }
  if (vdom.properties) {
    Object.keys(vdom.properties).forEach((propertyName) => {
      // @ts-ignore
      element[propertyName] = vdom.properties[propertyName]
    })
  }
  return element
}

export const appendToDom = (root, item) => {
  if (isString(item)) {
    if (root.innerHTML) {
      root.innerHTML = `${root.innerHTML}, ${item}`
    } else {
      root.innerHTML = item
    }
  } else if (item) {
    root?.appendChild(item)
  }
}

export const traverseVdom = (vdom, lastVdom) => {
  if (vdom === undefined || vdom === false) {
    return undefined
  } else if (isString(vdom)) {
    return vdom
  } else {
    let visited
    if (vdom.type === "custom") {
      const def = getDef(vdom.tag)
      const args = getArgs({ def, vdom })
      // console.log(`(R) ${vdom.tag} -> ${lastVdom === undefined ? "LAST" : "FIRST"}`)
      // console.log(vdom, lastVdom, document.getElementById(vdom.key))
      if (
        lastVdom !== undefined &&
        vdom !== undefined &&
        lastVdom.key !== undefined &&
        vdom.key !== undefined &&
        vdom.key === lastVdom.key
      ) {
        //   console.log(`Same key: ${vdom.key}`, document.getElementById(vdom.key))
        const lastDom = document.getElementById(vdom.key)
        if (lastDom) {
          visited = lastDom
        } else {
          visited = traverseVdom(def.render(args).render(), lastVdom)
        }
      } else {
        visited = traverseVdom(def.render(args).render(), lastVdom)
      }
    } else {
      visited = renderTagDom(vdom)
    }
    if (visited && vdom?.children) {
      arrayCombinator(vdom.children, (child, i) => {
        const childVdom = child?.render ? child.render() : child
        const visitedChild = traverseVdom(
          childVdom,
          lastVdom && Array.isArray(lastVdom.children) && i !== undefined ? lastVdom?.children[i] : undefined,
        )
        appendToDom(visited, visitedChild)
        if (childVdom && childVdom.type === "custom") {
          const def = getDef(childVdom.tag)
          if (def?.effect) {
            const args = getArgs({ vdom: childVdom, def })
            Lifecycle.afterRender({ def, args })
          }
        }
      })
    }
    return visited
  }
}

export const traversePreVdom = (prevdom: undefined | false | string | { render: () => VDOMItem; key: string }) => {
  if (prevdom === undefined || prevdom === false) {
    return undefined
  } else if (isString(prevdom)) {
    return prevdom
  } else {
    const rendered = prevdom.render()
    if (rendered !== undefined && !isString(rendered) && Array.isArray(rendered.children)) {
      rendered.children = mapCombinator(rendered.children, traversePreVdom)
    }
    return rendered
  }
}
