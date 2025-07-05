import { execSync } from "child_process"
import { join } from "path"
import { error, logEofolScript, PATH, primary, spawnOptions, success } from "./impl/util.js"

logEofolScript("deploy")

console.log(primary("Deploying project..."))

const resultCode = execSync(join(PATH.CWD, "scripts", "impl", "deploy.bat"), spawnOptions)

if (!resultCode) {
  console.log(success("Successfully deployed project."))
} else {
  console.log(error("Deployment of project failed."))
}
