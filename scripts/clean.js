import { rimraf } from "rimraf"
import { error, logEofolScript, PATH, success } from "./impl/util.js"

const clean = () => {
  rimraf.rimrafSync(PATH.distPath)
}

logEofolScript("clean")

try {
  clean()
} catch (e) {
  console.log(error("Clean failed"))
  throw new Error(e.message)
}

console.log(success("Successfully cleaned build folder."))
