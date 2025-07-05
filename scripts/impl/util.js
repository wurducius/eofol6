import chalk from "chalk"
import path from "path"
import fs from "node:fs"
import ConfigCompile from "../../config-compile.js"

export const primary = chalk.cyan
export const success = chalk.green
export const error = chalk.red

export const logEofolScript = (name) => {
  if (ConfigCompile.VERBOSE_COMPILE) {
    console.log(primary(`======= Eofol6 ${name} =======`))
  }
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
  if (seconds < 1) return `${ms} Milliseconds`
  if (seconds < 60) return `${seconds} Seconds`
  else if (minutes < 60) return `${minutes} Minutes`
  else if (hours < 24) return `${hours} Hours`
  else return `${days} Days`
}

export const dirSize = async (directory) => {
  const files = await fs.promises.readdir(directory, { recursive: true })
  const stats = files.map((file) => fs.promises.stat(path.join(directory, file)))
  return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0)
}

export const getArgv = (args) => {
  const argv = process.argv
  let argForce = false
  if (argv.length >= 2) {
    argv.forEach((a, i) => {
      if (i >= 2) {
        if (a === args.short || a === args.long) {
          argForce = true
        }
      }
    })
  }
  return argForce
}

export const spawnOptions = {
  encoding: "utf8",
  cwd: process.cwd(),
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit",
}

const CWD = process.cwd()
const publicPath = path.join(CWD, ConfigCompile.PUBLIC_DIRNAME)
const distDirname = ConfigCompile.BUILD_DIRNAME
const distPath = path.join(CWD, distDirname)
const assetsPath = path.join(distPath, "assets")
const jsPath = path.join(assetsPath, "js")
const cssPath = path.join(assetsPath, "css")
const mediaPath = path.join(assetsPath, "media")
const fontsPath = path.join(mediaPath, "fonts")
const imagesPath = path.join(mediaPath, "images")
const iconsPath = path.join(mediaPath, "icons")

export const PATH = {
  CWD,
  publicPath,
  distDirname,
  distPath,
  assetsPath,
  jsPath,
  cssPath,
  mediaPath,
  fontsPath,
  imagesPath,
  iconsPath,
}
