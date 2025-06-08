import fs from "node:fs"
import path from "path"
import webpack from "webpack"
import getWebpackConfig from "../../webpack/webpack.config.js"

const webpackConfig = getWebpackConfig()

const CWD = process.cwd()

const publicPath = path.join(CWD, "public")
const distPath = path.join(CWD, "dist")

const copyPublicDir = (source, target) => {
  fs.promises.readdir(source, { recursive: true }).then((dir) =>
    dir.map((file) => {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)
      return fs.promises.cp(sourcePath, targetPath)
    }),
  )
}

const buildWebpack = () => {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(`Webpack error: ${err}`)
    } else {
      console.log(`Project built at ${distPath}`)
    }
  })
}

export const build = () => {
  buildWebpack()
  copyPublicDir(publicPath, distPath)
}
