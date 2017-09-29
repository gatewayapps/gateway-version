import fs from 'fs'

export function readText (filePath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
  } else {
    return undefined
  }
}

export function readJson (filePath) {
  let text = readText(filePath)
  if (text) {
    return JSON.parse(text)
  } else {
    return undefined
  }
}

export function writeFile (filePath, content) {
  fs.writeFileSync(filePath, content)
}
