const Webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const webpackConfig = require("../webpack.config.js")
const { build } = require("./impl/build")

const compiler = Webpack(webpackConfig)
const devServerOptions = { ...webpackConfig.devServer, open: true }
const server = new WebpackDevServer(devServerOptions, compiler)

const runServer = async () => {
  console.log("Starting server...")
  await server.start()
}

build()
runServer()
