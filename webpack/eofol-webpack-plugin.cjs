const { primary, success, error, prettyTime, formatElapsed } = require("./plugin/plugin-util.cjs")
const { processViews } = require("./plugin/process-views")
const { optimizeAssets } = require("./plugin/optimize-assets")

const PLUGIN_NAME = "Eofol6 webpack plugin"

const onInitCompilation = (compiler) => (compilation) => {
  console.log(primary("Compiling project..."))
  compilation.hooks.processAssets.tapPromise(
    {
      name: PLUGIN_NAME,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    async () => {
      return await processViews(compiler, compilation)
    },
  )
}

// eslint-disable-next-line no-unused-vars
const onBuildStarted = (compilation) => {}

// eslint-disable-next-line no-unused-vars
const onCompilationFinished = (compiler) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: PLUGIN_NAME,
      //   stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
      additionalAssets: true,
    },
    (compiler) => optimizeAssets(compiler, compilation),
  )
}

// eslint-disable-next-line no-unused-vars
const onAfterCompile = (compiler) => (compilation) => {}

const onDone = (stats, callback) => {
  if (stats.compilation.errors.length > 0) {
    console.log(error(`Compilation failed: ${stats.compilation.errors}`))
  } else {
    console.log(
      success(`Project successfully compiled in ${prettyTime(formatElapsed(stats.endTime - stats.startTime))}.`),
    )
  }
  callback()
}

class EofolCompilerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(PLUGIN_NAME, onBuildStarted)
    compiler.hooks.compilation.tap(PLUGIN_NAME, onCompilationFinished(compiler))
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, onInitCompilation(compiler))
    compiler.hooks.afterCompile.tap(PLUGIN_NAME, onAfterCompile(compiler))
    compiler.hooks.done.tapAsync("done", onDone)
  }
}

module.exports.default = EofolCompilerWebpackPlugin
