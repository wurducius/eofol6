import { execSync } from "child_process"
import { logEofolScript } from "./impl/util.js"

const serveOptions = {
  open: true,
  port: 8080,
  root: "./dist",
}

logEofolScript("serve")

execSync(`npx http-server ${serveOptions.root} -p ${serveOptions.port}${serveOptions.open ? " -o" : ""}`)
