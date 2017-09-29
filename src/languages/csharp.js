import { getNewVersionNumber } from '../helpers/versionNumber'

const CSHARP_VERSION_REGEX = /AssemblyVersion\("([0-9.*]+)"\)/g

export function updateVersion (scope, fileContent) {
  let oldVersionNumber
  let newVersionNumber
  let newContent
  const match = CSHARP_VERSION_REGEX.exec(fileContent)

  if (match && match[1]) {
    oldVersionNumber = match[1]
    newVersionNumber = getNewVersionNumber(oldVersionNumber, scope)
    if (newVersionNumber) {
      newContent = fileContent.replace(CSHARP_VERSION_REGEX, `AssemblyVersion("${newVersionNumber}")`)
    }
  }

  return {
    oldVersionNumber: oldVersionNumber.replace('.*', ''),
    newVersionNumber: newVersionNumber.replace('.*', ''),
    content: newContent
  }
}
