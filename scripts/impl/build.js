import fs from "node:fs"
import path from "path"

const CWD = process.cwd()

const publicPath = path.join(CWD, "public")
const distPath = path.join(CWD, "dist")

export const build = () => {
  fs.promises.readdir(publicPath, { recursive: true }).then((dir) =>
    dir.map((file) => {
      const sourcePath = path.join(publicPath, file)
      const targetPath = path.join(distPath, file)
      return fs.promises.cp(sourcePath, targetPath)
    }),
  )
}
