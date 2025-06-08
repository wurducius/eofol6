import { rimraf } from "rimraf"
import { join } from "path"

const CWD = process.cwd()

const clean = () => {
  rimraf.rimrafSync(join(CWD, "dist"))
}

console.log("Eofol6 clean")
clean()
