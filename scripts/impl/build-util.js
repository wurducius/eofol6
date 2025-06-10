import fs from "node:fs"
import path from "path"
import webpack from "webpack"
import getWebpackConfigImport from "../../webpack/webpack.config.cjs"
import { PATH } from "./util.js"
import ConfigCompile from "../../config-compile.js"

const productionOptions = { mode: "production", sourceMap: false }

const getWebpackConfig = getWebpackConfigImport.default
const webpackConfig = getWebpackConfig(productionOptions)

export const touch = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

export const touchBuildDirs = () => {
  const paths = [
    PATH.assetsPath,
    PATH.jsPath,
    PATH.cssPath,
    PATH.mediaPath,
    PATH.fontsPath,
    PATH.imagesPath,
    PATH.iconsPath,
  ]
  paths.forEach((path) => {
    touch(path)
  })
}

export const copyPublicDir = (source, target) => {
  return fs.promises.readdir(source, { recursive: true }).then((dir) =>
    Promise.all(
      dir.map((file) => {
        const sourcePath = path.join(source, file)
        const targetPath = path.join(target, file)
        if (file.endsWith("html") || fs.lstatSync(path.join(source, file)).isDirectory()) {
          return
        }
        return fs.promises.cp(sourcePath, targetPath)
      }),
    ),
  )
}

export const buildWebpack = (onSuccess, onError) => {
  return webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      if (onError) {
        onError(err)
      }
      if (ConfigCompile.VERBOSE_COMPILE) {
        console.log(stats.errors)
      }
    } else if (onSuccess) {
      onSuccess()
    }
  })
}
