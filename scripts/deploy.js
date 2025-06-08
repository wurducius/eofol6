import { execSync } from "child_process"
import { join } from "path"
import { spawnOptions } from "./impl/spawn.js"

console.log("Eofol6 deploy")
console.log("Deploying project...")

const resultCode = execSync(join(process.cwd(), "scripts", "impl", "deploy.bat"), spawnOptions)

if (!resultCode) {
  console.log("Successfully deployed project.")
} else {
  console.log("Deployment of project failed.")
}
