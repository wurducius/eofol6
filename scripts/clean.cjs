const { rimraf } = require("rimraf")
const { error, logEofolScript, PATH, success } = require("./impl/util.cjs")

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
