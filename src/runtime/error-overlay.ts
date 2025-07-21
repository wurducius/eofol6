const { ERROR_OVERLAY_ENABLED } = require("../../constants.js")

const headerMsg = "Eofol runtime error:"

const appendDiv = (parent: Element, innerHtml?: string, style?: string) => {
  const header = document.createElement("div")
  if (style) {
    header.className = style
  }
  if (innerHtml) {
    header.innerHTML = innerHtml
  }
  parent.appendChild(header)
  return header
}

export const withErrorOverlay = (handler: () => void) => {
  if (ERROR_OVERLAY_ENABLED) {
    try {
      handler()
    } catch (ex) {
      const stacktraceMsg = `${ex.stack ? `Stacktrace: ${ex.stack}` : ""}`
      console.log(`${headerMsg} ${ex.message}- ${stacktraceMsg}`)
      const root = document.getElementById("root")
      if (root) {
        const container = appendDiv(root, undefined, "error-overlay-container")
        const padded = appendDiv(container, undefined, "error-overlay-padded error-overlay-padded-padding")
        appendDiv(padded, headerMsg, "error-overlay-header")
        appendDiv(padded, ex.message, "error-overlay-headerContent")
        appendDiv(padded, stacktraceMsg, "error-overlay-stacktrace")
      }
    }
  } else {
    handler()
  }
}
