import ConfigRuntime from "../../config-runtime"

const generateIdInternal = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

export const generateId = generateIdInternal(ConfigRuntime.KEY_LENGTH)
