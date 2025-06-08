const path = require("path")

const CWD = process.cwd()

module.exports = {
  mode: "development",
  entry: "./project/index.js",
  output: {
    filename: "main.js",
    path: path.join(CWD, "dist"),
  },
}
