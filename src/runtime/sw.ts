import { SERVICE_WORKER } from "../constants"

export const registerSw = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(SERVICE_WORKER.SERVICE_WORKER_PATH)
      .then((reg) => {
        if (SERVICE_WORKER.SERVICE_WORKER_VERBOSE) {
          console.log(`Registration succeeded. Scope is ${reg.scope}`)
        }
        if (reg.installing) {
          if (SERVICE_WORKER.SERVICE_WORKER_VERBOSE) {
            console.log("Service worker installing")
          }
        } else if (reg.waiting) {
          if (SERVICE_WORKER.SERVICE_WORKER_VERBOSE) {
            console.log("Service worker installed")
          }
        } else if (reg.active) {
          if (SERVICE_WORKER.SERVICE_WORKER_VERBOSE) {
            console.log("Service worker active")
          }
        }
      })
      .catch((error) => {
        if (SERVICE_WORKER.SERVICE_WORKER_VERBOSE) {
          console.log(`Registration failed with ${error}`)
        }
      })
  }
}
