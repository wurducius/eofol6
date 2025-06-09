import { rimraf } from "rimraf"
import { join } from "path"
import { error, logEofolScript, success } from "./impl/util.js"

const CWD = process.cwd()

const clean = () => {
  rimraf.rimrafSync(join(CWD, "dist"))
}

logEofolScript("clean")

try {
  clean()
} catch (e) {
  console.log(error("Cleaning failed"))
  throw new Error(e.message)
}

console.log(success("Successfully cleaned build folder."))
