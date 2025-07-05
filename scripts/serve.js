import { execSync } from "child_process"
import { logEofolScript } from "./impl/util.js"
import ConfigCompile from "../config-compile.js"

const serveOptions = {
  open: ConfigCompile.OPEN,
  port: ConfigCompile.PORT,
  root: `./${ConfigCompile.BUILD_DIRNAME}`,
}

logEofolScript("serve")

execSync(`npx http-server ${serveOptions.root} -p ${serveOptions.port}${serveOptions.open ? " -o" : ""}`)
