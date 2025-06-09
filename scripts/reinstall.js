import { execSync, spawn } from "child_process"
import { rmSync, existsSync } from "node:fs"
import { join } from "node:path"
import { error, logEofolScript, spawnOptions, success } from "./impl/util.js"

const argv = process.argv

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

const install = spawn("npm", ["i"], spawnOptions)

install.on("error", (data) => {
  console.log(error(`ERROR: ${data}`))
})
install.on("close", () => {
  console.log(success(`[${steps}/${steps}] Installed dependencies`))
  console.log(success("Reinstalled successfully."))
  process.exit(0)
})
