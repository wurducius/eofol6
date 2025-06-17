import Webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import getWebpackConfigImport from "../webpack/webpack.config.cjs"
import { error, logEofolScript, primary } from "./impl/util.js"
import ConfigCompile from "../config-compile.js"

const getWebpackConfig = getWebpackConfigImport.default

const argv = process.argv

let argAnalyze = false
if (argv.length >= 2) {
  argv.forEach((a, i) => {
    if (i >= 2) {
      if (a === "-a" || a === "--analyze") {
        argAnalyze = true
      }
    }
  })
}

const webpackConfig = getWebpackConfig({ analyze: argAnalyze })

const compiler = Webpack(webpackConfig)
const devServerOptions = { ...webpackConfig.devServer, open: ConfigCompile.OPEN, port: ConfigCompile.PORT }
const server = new WebpackDevServer(devServerOptions, compiler)

const runServer = async () => {
  console.log(primary("Starting dev server @ http://localhost:8080"))
  await server.startCallback((err) => {
    if (err) {
      console.log(error(`Compilation error: ${err.message}`))
    }
  })
}

logEofolScript("start")
if (ConfigCompile.VERBOSE_COMPILE) {
  console.log(primary("Starting server..."))
}
if (ConfigCompile.CLEAR_SCREEN) {
  console.clear()
}

runServer()
