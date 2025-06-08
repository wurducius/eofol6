import open from "open"

const projectUrl = encodeURIComponent("https://eofol.com/eofol6")

console.log("Eofol6 lighthouse")
await open(`https://pagespeed.web.dev/analysis?url=${projectUrl}`)
