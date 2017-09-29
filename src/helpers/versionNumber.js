export function getNewVersionNumber (versionNumber, scope) {
  if (typeof versionNumber !== 'string') {
    throw new TypeError('versionNumber should be a string')
  }

  const parts = versionNumber.split('.')

  if (parts.length >= 3) {
    switch (scope.toLowerCase()) {
      case 'major':
        var newMajor = increment(parts[0])
        if (newMajor !== false) {
          parts[0] = newMajor
          parts[1] = 0
          parts[2] = 0
        }
        break

      case 'minor':
        var newMinor = increment(parts[1])
        if (newMinor !== false) {
          parts[1] = increment(parts[1])
          parts[2] = 0
        }
        break

      case 'patch':
        var newPatch = increment(parts[2])
        if (newPatch !== false) {
          parts[2] = newPatch
        }
        break
    }
    return parts.join('.')
  } else {
    return undefined
  }
}

export function increment (input) {
  let value = parseInt(input)
  console.log(value)
  if (!isNaN(value)) {
    value++
    console.log(value)
    return value
  } else {
    return false
  }
}
