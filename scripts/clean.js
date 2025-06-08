import { rimraf } from "rimraf"
import { join } from "path"
import { error, primary, success } from "./impl/util.js"

const CWD = process.cwd()

const clean = () => {
  rimraf.rimrafSync(join(CWD, "dist"))
}

console.log(primary("Eofol6 clean"))

try {
  clean()
} catch (e) {
  console.log(error("Cleaning failed"))
  throw new Error(e.message)
}

console.log(success("Successfully cleaned build folder."))
