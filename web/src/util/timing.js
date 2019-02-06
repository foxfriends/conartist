export function debounce(duration) {
  let timeout
  return handler => {
    return (...args) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        handler(...args)
        timeout = null
      }, duration)
    }
  }
}

export function throttle(duration) {
  let timeout
  let argumentPack
  return handler => {
    return (...args) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          if (argumentPack) { handler(...argumentPack) }
          timeout = null
          argumentPack = null
        }, duration)
        handler(...args)
      } else {
        argumentPack = args
      }
    }
  }
}
