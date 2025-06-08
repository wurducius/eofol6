import Webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import getWebpackConfigImport from "../webpack/webpack.config.cjs"

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
const devServerOptions = { ...webpackConfig.devServer, open: true }
const server = new WebpackDevServer(devServerOptions, compiler)

const runServer = async () => {
  console.log("Eofol6 development")
  console.log("Starting server...")
  await server.start()
}

console.clear()
runServer()
