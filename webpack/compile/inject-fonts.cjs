const path = require("path")
const fs = require("node:fs")
const { CWD } = require("../plugin/plugin-util.cjs")

const resourcesPath = path.join(CWD, "resources")

const bytesToBase64 = (bytes) => btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""))

const injectFonts = (args) =>
  fs.promises.readFile(path.join(resourcesPath, args.path)).then(
    (fontData) => `@font-face {
              font-family: "${args.fontFamily}";
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: ${!args.isInline ? `url(./assets/media/fonts/${args.path}) format("${args.format}");` : `url('data:font/${args.format}; base64,${bytesToBase64(Uint8Array.from(fontData))}') format("woff2");`}}`,
  )

module.exports = { injectFonts }
