import { CRYPTO_KEY_ID_LENGTH } from "../constants"

const generateIdInternal = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

export const generateId = generateIdInternal(CRYPTO_KEY_ID_LENGTH)
