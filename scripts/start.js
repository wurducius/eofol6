import Webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import getWebpackConfigImport from "../webpack/webpack.config.cjs"
import { error, getArgv, logEofolScript, primary } from "./impl/util.js"
import ConfigCompile from "../config-compile.js"

const getWebpackConfig = getWebpackConfigImport.default

const argAnalyze = getArgv({ short: "-a", long: "--analyze" })

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
