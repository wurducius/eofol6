import { execSync, spawn } from "child_process"
import { rmSync, existsSync } from "node:fs"
import { join } from "node:path"
import { spawnOptions } from "./impl/spawn.js"

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

console.log("Eofol6 reinstall")

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
