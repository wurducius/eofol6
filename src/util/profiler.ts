import ConfigRuntime from "../../config-runtime"
import { logProfiler } from "./log"
import { PROFILER_PRECISION_DIGITS } from "../constants"

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

export const getCurrentTime = () => window.performance.now()

export const formatElapsed = (delta: number) => Number(delta.toFixed(PROFILER_PRECISION_DIGITS))

let profilerRegistry: Record<string, number> = {}

export const profilerStart = (label: string) => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    const time = getCurrentTime()
    profilerRegistry[label] = time
    return time
  }
}

export const getProfiler = (label: string) => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    const time = profilerRegistry[label]
    delete profilerRegistry[label]
    return time
  }
}

export const profilerEnd = (label: string, msg: string) => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    const end = getCurrentTime()
    const start = profilerRegistry[label]
    logProfiler(`${msg} took ${prettyTime(formatElapsed(end - start))}`)
    delete profilerRegistry[label]
  }
}

export const profilerClear = () => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    profilerRegistry = {}
  }
}
