const { argv } = require("node:process")
const { execSync, spawn } = require("child_process")
const { rmSync, existsSync } = require("node:fs")
const { join } = require("node:path")
const { spawnOptions } = require("./impl/spawn")

let argForce = false
if (argv.length >= 2) {
  argv.forEach((a, i) => {
    if (i >= 2) {
      if (a === "-f" || a === "--force") {
        argForce = true
      }
    }
  })
}

const CWD = process.cwd()

const packageLockPath = join(CWD, "package-lock.json")
const nodeModulesPath = join(CWD, "node_modules")

if (existsSync(packageLockPath)) {
  rmSync(packageLockPath)
  console.log("Deleted package-lock.json")
}

if (existsSync(nodeModulesPath)) {
  rmSync(nodeModulesPath, { recursive: true })
  console.log("Deleted node_modules")
}

if (argForce) {
  execSync("npm cache clean --force")
  console.log("Cleaned forcefully npm cache")
}

const install = spawn("npm", ["i"], spawnOptions)

install.on("error", (data) => {
  console.log(`ERROR: ${data}`)
})
install.on("close", () => {
  process.exit(0)
  console.log("Installed dependencies")
})
