const { rimraf } = require("rimraf")
const { join } = require("path")

const CWD = process.cwd()

const clean = () => {
  rimraf.rimrafSync(join(CWD, "dist"))
}

console.log("Eofol6 clean")
clean()
