const getRandomStringImpl = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

export const getRandomString = getRandomStringImpl(17)

export const useGeolocation = () =>
  new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      })
    })
  })
