import { logEofolScript, error, prettySize, prettyTime, success, dirSize, PATH } from "./impl/util.js"
import { buildWebpack, copyPublicDir, touchBuildDirs } from "./impl/build-util.js"
import ConfigCompile from "../config-compile.js"

const { VERBOSE_COMPILE, PROFILER_COMPILE } = ConfigCompile

const build = () => {
  const start = new Date().valueOf()
  buildWebpack(
    () => {
      const webpackBuilt = new Date().valueOf()
      if (PROFILER_COMPILE) {
        console.log(success(`[1/2] Webpack compilation took: ${prettyTime(webpackBuilt - start)}`))
      }
      touchBuildDirs()
      copyPublicDir(PATH.publicPath, PATH.distPath).then(() => {
        const publicDirCopied = new Date().valueOf()
        if (PROFILER_COMPILE) {
          console.log(success(`[2/2] Copying public directory took: ${prettyTime(publicDirCopied - webpackBuilt)}`))
        }
        console.log(success("Build successful"))
        if (PROFILER_COMPILE) {
          dirSize(PATH.distPath).then((size) => {
            console.log(success(`Total build took: ${prettyTime(publicDirCopied - start)}`))
            console.log(success(`Build size: ${prettySize(size)}`))
          })
        }
        if (VERBOSE_COMPILE) {
          console.log(success(`Project built at: ${PATH.distPath}`))
        }
      })
    },
    (err) => {
      console.log(error(`Build failed: ${err}`))
    },
  )
}

logEofolScript("build")
build()
