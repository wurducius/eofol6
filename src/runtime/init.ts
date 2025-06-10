import { registerSw } from "./sw"
import ConfigRuntime from "../../config-runtime"

export const initEofol = () => {
  registerSw({
    enabled: ConfigRuntime.SERVICE_WORKER_ENABLED,
    swPath: ConfigRuntime.SERVICE_WORKER_PATH,
    verbose: ConfigRuntime.VERBOSE_RUNTIME,
  }).then(() => {
    if (ConfigRuntime.VERBOSE_RUNTIME) {
      console.log("Eofol initialized.")
    }
  })
}
