import fs from "node:fs"
import path from "path"
import { addAsset, CWD } from "../plugin/plugin-util.cjs"
import { SW_FILENAME, SW_FILES_MARKER } from "../../constants.js"

const resourcesPath = path.join(CWD, "resources")
const publicPath = path.join(CWD, "public")
const swPath = path.join(resourcesPath, SW_FILENAME)

const transformPathToHtml = (item) => item.replaceAll(path.sep, "/")

export const injectSw = (compilation) =>
  fs.promises.readFile(swPath).then(async (swContent) => {
    const swAssets = Object.keys(compilation.assets)
    await fs.promises.readdir(publicPath, { recursive: true }).then((dir) => {
      const swFiles = [...swAssets, ...dir].map(transformPathToHtml)
      const swInject = `"${swFiles.join('", "')}"`
      const content = swContent.toString().replaceAll(SW_FILES_MARKER, swInject)
      addAsset(compilation, SW_FILENAME, content)
    })
  })
