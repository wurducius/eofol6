import { registerSw } from "./sw"
import ConfigRuntime from "../../config-runtime"
import { formatElapsed, getCurrentTime, getProfiler, info, prettyTime, profilerStart } from "../util"

export const initEofol = () => {
  if (ConfigRuntime.PROFILER_RUNTIME) {
    const start = profilerStart("init") as number
    info(`Eofol initializing in ${prettyTime(formatElapsed(start))}`)
  }
  registerSw({
    enabled: ConfigRuntime.SERVICE_WORKER_ENABLED,
    swPath: ConfigRuntime.SERVICE_WORKER_PATH,
    verbose: ConfigRuntime.VERBOSE_RUNTIME,
  }).then(() => {
    if (ConfigRuntime.VERBOSE_RUNTIME) {
      const end = getCurrentTime()
      const start = getProfiler("init") as number
      info(`Eofol init took ${prettyTime(formatElapsed(end - start))}`)
      info(`Eofol ready in ${prettyTime(formatElapsed(end))}`)
    }
  })
}
