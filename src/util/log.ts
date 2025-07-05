const LOG_MSG_PREFIX = "Eofol"

const LOG_MSG_INFO = "INFO"
const LOG_MSG_WARN = "WARNING"
const LOG_MSG_ERROR = "ERROR"
const LOG_MSG_PROFILER = "PROFILER"

export const log = (msg: string) => {
  console.log(msg)
}

const logImpl = (level: string) => (msg: string) => {
  const now = new Date()
  log(
    `${LOG_MSG_PREFIX} [${level}] @ ${now.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}.${now.getMilliseconds()} -> ${msg}`,
  )
}

export const info = logImpl(LOG_MSG_INFO)
export const warn = logImpl(LOG_MSG_WARN)
export const err = logImpl(LOG_MSG_ERROR)
export const logProfiler = logImpl(LOG_MSG_PROFILER)
