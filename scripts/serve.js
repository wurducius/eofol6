import { execSync } from "child_process"

const serveOptions = {
  open: true,
  port: 8080,
  root: "./dist",
}

console.log("Eofol6 serve")

execSync(`npx http-server ${serveOptions.root} -p ${serveOptions.port}${serveOptions.open ? " -o" : ""}`)
