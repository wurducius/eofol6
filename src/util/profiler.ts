import ConfigRuntime from "../../config-runtime"

export const prettyTime = (ms: number) => {
  let seconds = Number((ms / 1000).toFixed(1))
  let minutes = Number((ms / (1000 * 60)).toFixed(1))
  let hours = Number((ms / (1000 * 60 * 60)).toFixed(1))
  let days = Number((ms / (1000 * 60 * 60 * 24)).toFixed(1))
  if (seconds < 1) return `${ms} ms`
  if (seconds < 60) return `${seconds} s`
  else if (minutes < 60) return `${minutes} m`
  else if (hours < 24) return `${hours} h`
  else return `${days} d`
}

export const getCurrentTime = () => performance.now()

const profilerRegistry: Record<string, number> = {}

export const profilerStart = (label: string) => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    profilerRegistry[label] = getCurrentTime()
  }
}

export const profilerEnd = (label: string, msg: string) => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    const start = profilerRegistry[label]
    const end = getCurrentTime()
    const delta = Number((end - start).toFixed(1))
    console.log("EOFOL PROFILER: " + msg + " took " + prettyTime(delta))
    delete profilerRegistry[label]
  }
}
