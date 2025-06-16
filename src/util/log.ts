const LOG_MSG_PREFIX = "Eofol"

const LOG_MSG_INFO = "INFO"
const LOG_MSG_WARN = "WARNING"
const LOG_MSG_ERROR = "ERROR"

export const log = (msg: string) => {
  console.log(msg)
}

export const info = (msg: string) => {
  log(`${LOG_MSG_PREFIX} [${LOG_MSG_INFO}] -> ${msg}`)
}

export const warn = (msg: string) => {
  log(`${LOG_MSG_PREFIX} [${LOG_MSG_WARN}] -> ${msg}`)
}

export const err = (msg: string) => {
  log(`${LOG_MSG_PREFIX} [${LOG_MSG_ERROR}] -> ${msg}`)
}
