const envBoolean = (name: string, defaultValue: boolean) => {
  if (defaultValue) {
    return process.env[name] !== "false"
  } else {
    return process.env[name] === "true"
  }
}

const envString = (name: string, defaultValue: string) => process.env[name] ?? defaultValue

const envNumber = (name: string, defaultValue: number) => (process.env[name] ? Number(process.env[name]) : defaultValue)

const ConfigRuntime: ConfigRuntimeType = {
  SERVICE_WORKER_ENABLED: envBoolean("SERVICE_WORKER_ENABLED", true),
  SERVICE_WORKER_PATH: envString("SERVICE_WORKER_PATH", "service-worker.js"),
  PROFILER_RUNTIME: envBoolean("PROFILER_RUNTIME", true),
  VERBOSE_RUNTIME: envBoolean("VERBOSE_RUNTIME", true),
  LOG_LEVEL_RUNTIME: envNumber("LOG_LEVEL_RUNTIME", 3),
  KEY_LENGTH: envNumber("KEY_LENGTH", 17),
}

export type ConfigRuntimeType = {
  SERVICE_WORKER_ENABLED: boolean
  SERVICE_WORKER_PATH: string
  PROFILER_RUNTIME: boolean
  VERBOSE_RUNTIME: boolean
  LOG_LEVEL_RUNTIME: number
  KEY_LENGTH: number
}

export default ConfigRuntime
