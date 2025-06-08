import { execSync } from "child_process"

const serveOptions = {
  open: true,
  port: 8080,
  root: "./dist",
}

execSync(`npx http-server ${serveOptions.root} -p ${serveOptions.port}${serveOptions.open ? " -o" : ""}`)
