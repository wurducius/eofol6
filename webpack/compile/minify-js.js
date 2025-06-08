import { minify } from "uglify-js"

const uglifyOptions = {
  parse: {},
  compress: true,
  mangle: true,
  output: {
    semicolons: false,
  },
}

const minifyJs = (content) => minify(content, uglifyOptions).code

export default minifyJs
