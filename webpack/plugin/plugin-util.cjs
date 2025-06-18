const chalk = require("chalk")

const CWD = process.cwd()

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

const getAsset = ({ asset, nextSource, nextSize, nextInfo }) => {
  const map = asset ? asset.map() : null
  return {
    source: () => nextSource,
    map: () => map,
    sourceAndMap: () => ({
      source: nextSource,
      map,
    }),
    size: () => nextSize,
    info: nextInfo,
  }
}

const addAsset = (compilation, assetName, nextSource, info, merge) => {
  compilation.assets[assetName] = getAsset({
    ...(merge ? compilation.assets[assetName] : {}),
    nextSource,
    nextInfo: info ?? {},
    nextSize: nextSource.length,
  })
}

module.exports = { CWD, primary, error, success, formatElapsed, prettyTime, addAsset }
