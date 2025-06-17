const path = require("path")
const BundleAnalyzerPluginImport = require("webpack-bundle-analyzer")
const EofolPluginImport = require("./eofol-webpack-plugin.cjs")
const Dotenv = require("dotenv-webpack")

const EofolPlugin = EofolPluginImport.default
const BundleAnalyzerPlugin = BundleAnalyzerPluginImport.BundleAnalyzerPlugin

const CWD = process.cwd()

const buildOptionsDefault = {
  mode: "development",
  analyze: false,
  sourceMap: true,
  projectPath: "./project",
  entryFilename: "index.ts",
  outputBundleFilename: "main.js",
  distDirname: "dist",
}

module.exports.default = (args) => {
  const buildOptions = { ...buildOptionsDefault, ...(args ?? {}) }

  return {
    mode: buildOptions.mode,
    entry: `${buildOptions.projectPath}/${buildOptions.entryFilename}`,
    output: {
      filename: "assets/js/[name].js",
      path: path.join(CWD, buildOptions.distDirname),
      publicPath: undefined,
    },
    plugins: [new EofolPlugin(), buildOptions.analyze && new BundleAnalyzerPlugin(), new Dotenv()].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    devtool: buildOptions.sourceMap ? "source-map" : false,
    infrastructureLogging: {
      appendOnly: true,
      level: "error",
    },
    stats: "none",
  }
}

/*
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/, http://[::1]:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://172.17.4.128:8080/
<i> [webpack-dev-server] Content not from webpack is served from 'c:\code\eofol6\public' directory
<i> [webpack-dev-middleware] wait until bundle finished: /

webpack 5.99.9 compiled successfully in 5181 ms

[webpack-dev-server] Server started: Hot Module Replacement enabled, Live Reloading enabled, Progress disabled, Overlay enabled.
main.js:238 [HMR] Waiting for update signal from WDS...

<i> [webpack-dev-server] Gracefully shutting down. To force exit, press ^C again. Please wait...

---------------------------------------------------


<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/, http://[::1]:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://172.17.4.128:8080/
<i> [webpack-dev-server] Content not from webpack is served from 'c:\code\eofol6\public' directory
<i> [webpack-dev-middleware] wait until bundle finished: /
asset assets/js/main.js 79.7 KiB [emitted] (name: main)
asset index.html 3.65 KiB [emitted]
asset service-worker.js 613 bytes [emitted]
runtime modules 27.4 KiB 12 modules
cacheable modules 153 KiB
  modules by path ./src/ 31.3 KiB 26 modules
  modules by path ./node_modules/ 111 KiB
    modules by path ./node_modules/webpack-dev-server/client/ 84.8 KiB 8 modules
    modules by path ./node_modules/webpack/hot/*.js 5.17 KiB 4 modules
    ./node_modules/eofol-sx/build/index.js 2.19 KiB [built] [code generated]
    ./node_modules/events/events.js 14.5 KiB [built] [code generated]
    ./node_modules/ansi-html-community/index.js 4.16 KiB [built] [code generated]
  modules by path ./project/*.ts 9.95 KiB
    ./project/index.ts 7.87 KiB [built] [code generated]
    ./project/util.ts 304 bytes [built] [code generated]
    ./project/e-ui.ts 504 bytes [built] [code generated]
    ./project/notification.ts 1.29 KiB [built] [code generated]
  ./config-runtime.ts 936 bytes [built] [code generated]
webpack 5.99.9 compiled successfully in 4459 ms
<i> [webpack-dev-server] Gracefully shutting down. To force exit, press ^C again. Please wait...
 */
