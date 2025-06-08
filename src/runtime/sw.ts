export const registerSw = (SERVICE_WORKER: { enabled: boolean; swPath: string; verbose: boolean }) => {
  if (SERVICE_WORKER.enabled && "serviceWorker" in navigator) {
    return navigator.serviceWorker
      .register(SERVICE_WORKER.swPath)
      .then((reg) => {
        if (SERVICE_WORKER.verbose) {
          console.log(`Registration succeeded. Scope is ${reg.scope}`)
        }
        if (reg.installing) {
          if (SERVICE_WORKER.verbose) {
            console.log("Service worker installing")
          }
        } else if (reg.waiting) {
          if (SERVICE_WORKER.verbose) {
            console.log("Service worker installed")
          }
        } else if (reg.active) {
          if (SERVICE_WORKER.verbose) {
            console.log("Service worker active")
          }
        }
      })
      .catch((error) => {
        if (SERVICE_WORKER.verbose) {
          console.log(`Registration failed with ${error}`)
        }
      })
  } else {
    return new Promise(() => undefined)
  }
}
