const ERROR_OVERLAY_ENABLED = true

const ERROR_OVERLAY_BG_COLOR = "#330a0a"
const ERROR_OVERLAY_FONT_COLOR = "#e70404ff"
const ERROR_OVERLAY_CONTAINER_WIDTH = 640
const ERROR_OVERLAY_CONTAINER_PADDING = 64
const ERROR_OVERLAY_CONTAINER_PADDING_SMALL = 16
const ERROR_OVERLAY_HEADER_FONT_SIZE = 24
const ERROR_OVERLAY_STACKTRACE_FONT_SIZE = 16
const ERROR_OVERLAY_HEADER_MARGIN = 32
const ERROR_OVERLAY_HEADER_CONTENT_FONT_WEIGHT = 700

const containerStyle = `display: flex; flex-direction: column; align-items: center; background-color: ${ERROR_OVERLAY_BG_COLOR}; color: ${ERROR_OVERLAY_FONT_COLOR}; height: 100%; overflow: auto;`
const paddedStyle = (large: boolean) =>
  `display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: ${ERROR_OVERLAY_CONTAINER_WIDTH}px; padding: ${large ? ERROR_OVERLAY_CONTAINER_PADDING : ERROR_OVERLAY_CONTAINER_PADDING_SMALL}px ${large ? ERROR_OVERLAY_CONTAINER_PADDING : ERROR_OVERLAY_CONTAINER_PADDING_SMALL}px; margin: 0 auto 0 auto;`
const headerStyle = `font-size: ${ERROR_OVERLAY_HEADER_FONT_SIZE}px; margin-bottom: ${ERROR_OVERLAY_HEADER_MARGIN}px;`
const headerContentStyle = `font-size: ${ERROR_OVERLAY_HEADER_FONT_SIZE}px; margin-bottom: ${ERROR_OVERLAY_HEADER_MARGIN}px; font-weight: ${ERROR_OVERLAY_HEADER_CONTENT_FONT_WEIGHT};`
const stacktraceStyle = `font-size: ${ERROR_OVERLAY_STACKTRACE_FONT_SIZE}px;`

const headerMsg = "Eofol compilation error:"

const appendDiv = (parent: Element, innerHtml?: string, style?: string) => {
  const header = document.createElement("div")
  if (style) {
    header.style = style
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
      console.error(`${headerMsg} ${ex.message}- ${stacktraceMsg}`)
      const large = window.screen.width >= 640
      const root = document.getElementById("root")
      if (root) {
        const container = appendDiv(root, undefined, containerStyle)
        const padded = appendDiv(container, undefined, paddedStyle(large))
        appendDiv(padded, headerMsg, headerStyle)
        appendDiv(padded, ex.message, headerContentStyle)
        appendDiv(padded, stacktraceMsg, stacktraceStyle)
      }
    }
  } else {
    handler()
  }
}
