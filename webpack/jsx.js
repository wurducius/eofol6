import jsx from "acorn-jsx"
import { fromJs } from "esast-util-from-js"
import { buildJsx } from "estree-util-build-jsx"
import { toJs } from "estree-util-to-js"
import { join } from "path"
import { existsSync, promises } from "node:fs"

const CWD = process.cwd()
const projectPath = join(CWD, "project")
const distPath = join(CWD, "dist")

const compileJsx = (doc) => {
  const tree = fromJs(doc, { module: true, plugins: [jsx()] })
  buildJsx(tree, { pragma: "j", pragmaFrag: "null" })
  return toJs(tree).value
}

const injectImportPragma = (content) => `import { j } from "../../src"\n${content}`

const getViewPathSource = (next) => join(projectPath, `${next}.tsx`)

const getViewPathTarget = (next) => join(distPath, `${next}.js`)

const compileViewJsx = async (view) => {
  const viewPath = getViewPathTarget(view)
  let source
  if (existsSync(viewPath)) {
    source = promises.readFile(getViewPathSource(view))
  } else {
    source = new Promise(() => "")
  }
  const content = await source
  const result = injectImportPragma(compileJsx(content.toString()))
  console.log(`WRITE TO ${viewPath}`, `CONTENT: ${result}`)
  // return promises.writeFile(viewPath, result)
}

export const compileViewsJsx = (views) => {
  return Promise.all(views.map(compileViewJsx))
}
