import open from "open"
import { logEofolScript } from "./impl/util.js"

const projectUrl = encodeURIComponent("https://eofol.com/eofol6")

logEofolScript("lighthouse")

await open(`https://pagespeed.web.dev/analysis?url=${projectUrl}`)
