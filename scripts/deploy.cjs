const { execSync } = require("child_process")
const { join } = require("path")
const { error, logEofolScript, PATH, primary, spawnOptions, success } = require("./impl/util.cjs")

logEofolScript("deploy")

console.log(primary("Deploying project..."))

const resultCode = execSync(join(PATH.CWD, "scripts", "impl", "deploy.bat"), spawnOptions)

if (!resultCode) {
  console.log(success("Successfully deployed project."))
} else {
  console.log(error("Deployment of project failed."))
}
