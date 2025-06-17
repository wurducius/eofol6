const chalk = require("chalk")

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

module.exports = { primary, error, success, formatElapsed, prettyTime }
