const { execSync } = require("child_process")
const { join } = require("path")
const { spawnOptions } = require("./impl/spawn")

console.log("Eofol6 deploy")
console.log("Deploying project...")

const resultCode = execSync(join(process.cwd(), "scripts", "impl", "deploy.bat"), spawnOptions)

if (!resultCode) {
  console.log("Successfully deployed project.")
} else {
  console.log("Deployment of project failed.")
}
