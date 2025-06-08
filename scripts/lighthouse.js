import open from "open"
import { primary } from "./impl/util.js"

const projectUrl = encodeURIComponent("https://eofol.com/eofol6")

console.log(primary("Eofol6 lighthouse"))

await open(`https://pagespeed.web.dev/analysis?url=${projectUrl}`)
