import { logEofolScript, error, prettySize, prettyTime, success } from "./impl/util.js"
import fs from "node:fs"
import path from "path"
import webpack from "webpack"
import getWebpackConfigImport from "../webpack/webpack.config.cjs"

const getWebpackConfig = getWebpackConfigImport.default

const productionOptions = { mode: "production", sourceMap: false }

const webpackConfig = getWebpackConfig(productionOptions)

const CWD = process.cwd()

const publicPath = path.join(CWD, "public")
const distPath = path.join(CWD, "dist")

const touch = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

const copyPublicDir = (source, target) => {
  return fs.promises.readdir(source, { recursive: true }).then((dir) =>
    dir.map((file) => {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)
      if (file.endsWith("html") || fs.lstatSync(path.join(source, file)).isDirectory()) {
        return
      }
      return fs.promises.cp(sourcePath, targetPath)
    }),
  )
}

const buildWebpack = (onSuccess, onError) => {
  return webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      if (onError) {
        onError(err)
      }
    } else {
      console.log(success(`Project built at: ${distPath}`))
      if (onSuccess) {
        onSuccess()
      }
    }
  })
}

const touchBuildDirs = () => {
  const assetsPath = path.join(distPath, "assets")
  const mediaPath = path.join(assetsPath, "media")
  const paths = [
    assetsPath,
    path.join(assetsPath, "js"),
    path.join(assetsPath, "css"),
    path.join(mediaPath),
    path.join(mediaPath, "fonts"),
    path.join(mediaPath, "images"),
    path.join(mediaPath, "icons"),
  ]
  paths.forEach((path) => {
    touch(path)
  })
}

const dirSize = async (directory) => {
  const files = await fs.promises.readdir(directory)
  const stats = files.map((file) => fs.promises.stat(path.join(directory, file)))
  return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0)
}

const build = () => {
  const start = new Date().valueOf()
  buildWebpack(
    () => {
      touchBuildDirs()
      copyPublicDir(publicPath, distPath).then(() => {
        const elapsed = new Date().valueOf() - start
        dirSize(distPath).then((size) => {
          console.log(success(`Build size: ${prettySize(size)}`))
          console.log(success(`Compilation took: ${prettyTime(elapsed)}`))
        })
      })
    },
    (err) => {
      console.log(error(`Build failed: ${err}`))
    },
  )
}

logEofolScript("build")
build()
