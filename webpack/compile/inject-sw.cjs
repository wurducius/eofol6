const fs = require("node:fs")
const { addAsset, publicPath, swPath, transformPathToHtml } = require("../plugin-util.cjs")
const { SW_FILENAME, SW_FILES_MARKER } = require("../../constants.js")

const injectSw = (compilation) =>
  fs.promises.readFile(swPath).then(async (swContent) => {
    const swAssets = Object.keys(compilation.assets)
    await fs.promises.readdir(publicPath, { recursive: true }).then((dir) => {
      const swFiles = [...swAssets, ...dir.filter((file) => file.includes("."))].map(transformPathToHtml)
      const swInject = `"${swFiles.join('", "')}"`
      const content = swContent.toString().replaceAll(SW_FILES_MARKER, swInject)
      addAsset(compilation, SW_FILENAME, content)
    })
  })

module.exports = injectSw
