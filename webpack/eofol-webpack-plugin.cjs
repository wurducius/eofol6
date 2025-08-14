const chalk = require("chalk")

const PLUGIN_NAME = "Eofol6 webpack plugin"

const primary = chalk.cyan
const success = chalk.green
const error = chalk.red

const prettyTime = (ms) => {
  let seconds = Number((ms / 1000).toFixed(1))
  let minutes = Number((ms / (1000 * 60)).toFixed(1))
  let hours = Number((ms / (1000 * 60 * 60)).toFixed(1))
  let days = Number((ms / (1000 * 60 * 60 * 24)).toFixed(1))
  if (seconds < 1) return `${ms} ms`
  if (seconds < 60) return `${seconds} s`
  else if (minutes < 60) return `${minutes} m`
  else if (hours < 24) return `${hours} h`
  else return `${days} d`
}

const formatElapsed = (delta) => Number(delta.toFixed(1))

// eslint-disable-next-line no-unused-vars
const onInitCompilation = (compiler) => (compilation) => {
  console.log(primary("Compiling project..."))
  return new Promise((resolve) => resolve(true))
}

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
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, onInitCompilation(compiler))
    compiler.hooks.done.tapAsync("done", onDone)
  }
}

module.exports.default = EofolCompilerWebpackPlugin
