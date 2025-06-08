const { eofolCompile, processViews } = require("./eofol-compile")

const PLUGIN_NAME = "Eofol6 webpack plugin"

const onInitCompilation = (compiler) => (compilation) => {
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
    (compiler) => eofolCompile(compiler, compilation),
  )
}

// eslint-disable-next-line no-unused-vars
const onAfterCompile = (compiler) => (compilation) => {}

class EofolCompilerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(PLUGIN_NAME, onBuildStarted)
    compiler.hooks.compilation.tap(PLUGIN_NAME, onCompilationFinished(compiler))
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, onInitCompilation(compiler))
    compiler.hooks.afterCompile.tap(PLUGIN_NAME, onAfterCompile(compiler))
  }
}

module.exports = EofolCompilerWebpackPlugin
