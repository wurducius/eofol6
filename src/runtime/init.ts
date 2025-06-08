import { registerSw } from "./sw"

const RUNTIME_CONFIG = {
  SERVICE_WORKER_ENABLED: process.env.SERVICE_WORKER_ENABLED === "true",
  SERVICE_WORKER_PATH: process.env.SERVICE_WORKER_PATH ?? "service-worker.js",
  VERBOSE: process.env.VERBOSE === "true",
}

export const initEofol = () => {
  registerSw({
    enabled: RUNTIME_CONFIG.SERVICE_WORKER_ENABLED,
    swPath: RUNTIME_CONFIG.SERVICE_WORKER_PATH,
    verbose: RUNTIME_CONFIG.VERBOSE,
  }).then(() => {
    if (RUNTIME_CONFIG.VERBOSE) {
      console.log("Eofol initialized.")
    }
  })
}
