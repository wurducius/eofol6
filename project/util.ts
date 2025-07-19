const getRandomStringImpl = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

export const getRandomString = getRandomStringImpl(17)
