const { execSync, spawn } = require("child_process")
const { rmSync, existsSync } = require("node:fs")
const { join } = require("node:path")
const { error, getArgv, logEofolScript, PATH, spawnOptions, success } = require("./impl/util.cjs")

const argForce = getArgv({ short: "-f", long: "--force" })

const packageLockPath = join(PATH.CWD, "package-lock.json")
const nodeModulesPath = join(PATH.CWD, "node_modules")

const steps = argForce ? 4 : 3

logEofolScript("reinstall")

if (existsSync(packageLockPath)) {
  rmSync(packageLockPath)
  console.log(success(`[1/${steps}] Deleted package-lock.json`))
}

if (existsSync(nodeModulesPath)) {
  rmSync(nodeModulesPath, { recursive: true })
  console.log(success(`[2/${steps}] Deleted node_modules`))
}

if (argForce) {
  execSync("npm cache clean --force")
  console.log(success(`[3/${steps}] Cleaned forcefully npm cache`))
}

const install = spawn("npm i", [], spawnOptions)

install.on("error", (data) => {
  console.log(error(`ERROR: ${data}`))
})
install.on("close", () => {
  console.log(success(`[${steps}/${steps}] Installed dependencies`))
  console.log(success("Reinstalled successfully."))
  process.exit(0)
})
