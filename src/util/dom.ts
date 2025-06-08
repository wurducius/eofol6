export const domClearChildren = (domElement: Element) => {
  const childrenToDelete = []
  for (let i = 0; i < domElement.childNodes.length; i++) {
    childrenToDelete.push(domElement.childNodes.item(i))
  }
  childrenToDelete.forEach((childToDelete) => {
    if (childToDelete) {
      domElement.removeChild(childToDelete)
    }
  })
}
