import chalk from "chalk"

export const primary = chalk.cyan
export const success = chalk.green
export const error = chalk.red

export const logEofolScript = (name) => {
  console.log(primary(`======= Eofol6 ${name} =======`))
}

export const prettySize = (size) => {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${["B", "kB", "MB", "GB", "TB"][i]}`
}

export const prettyTime = (ms) => {
  let seconds = (ms / 1000).toFixed(1)
  let minutes = (ms / (1000 * 60)).toFixed(1)
  let hours = (ms / (1000 * 60 * 60)).toFixed(1)
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) return `${seconds} Seconds`
  else if (minutes < 60) return `${minutes} Minutes`
  else if (hours < 24) return `${hours} Hours`
  else return `${days} Days`
}

export const spawnOptions = {
  encoding: "utf8",
  cwd: process.cwd(),
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit",
}
