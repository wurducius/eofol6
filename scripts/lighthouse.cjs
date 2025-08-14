const open = require("open").default
const { logEofolScript } = require("./impl/util.cjs")

const projectUrl = encodeURIComponent("https://eofol.com/eofol6")

logEofolScript("lighthouse")

open(`https://pagespeed.web.dev/analysis?url=${projectUrl}`)
