import { execSync } from "child_process"
import { primary } from "./impl/util.js"

const serveOptions = {
  open: true,
  port: 8080,
  root: "./dist",
}

console.log(primary("Eofol6 serve"))

execSync(`npx http-server ${serveOptions.root} -p ${serveOptions.port}${serveOptions.open ? " -o" : ""}`)
