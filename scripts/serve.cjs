const { execSync } = require("child_process")
const { logEofolScript } = require("./impl/util.cjs")
const ConfigCompile = require("../config-compile.cjs")

const serveOptions = {
  open: ConfigCompile.OPEN,
  port: ConfigCompile.PORT,
  root: `./${ConfigCompile.BUILD_DIRNAME}`,
}

logEofolScript("serve")

execSync(`npx http-server ${serveOptions.root} -p ${serveOptions.port}${serveOptions.open ? " -o" : ""}`)
