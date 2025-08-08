const path = require("path")
const fs = require("node:fs")
const { resourcesPath } = require("../plugin/plugin-util.cjs")

const bytesToBase64 = (bytes) => btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""))

const injectFonts = (args) =>
  fs.promises.readFile(path.join(resourcesPath, args.path)).then(
    (fontData) => `@font-face {
              font-family: "${args.fontFamily}";
              font-style: ${args.fontStyle ?? "normal"};
              font-weight: ${args.fontWeight ?? "400"};
              font-display: ${args.fontDisplay ?? "swap"};
              src: ${!args.isInline ? `url(./assets/media/fonts/${args.path})` : `url('data:font/${args.format}; base64,${bytesToBase64(Uint8Array.from(fontData))}')`}
              format("${args.format}");
              }
              body { font-family: ${args.fontFamily}${args.fontFamilyFallback ? `, ${args.fontFamilyFallback}` : ""}; font-size: 1rem; }`,
  )

module.exports = injectFonts

/*
          return injectFonts({
            path: "Roboto-Regular.woff2",
            fontFamily: "Roboto",
            fontFamilyFallback: "sans-serif",
            format: "woff2",
            isInline: false,
            fontStyle: "normal",
            fontWeight: 400,
            fontDisplay: "swap",
          }).then((fontFace) => {
            const headNext = `${headOld}<style>${fontFace}</style>`
            return split.map((part, i) => (i === 0 ? headNext : part)).join(MARKER_STYLE_TAG_END)
          })
        })
*/
