import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import * as fileHelper from '../helpers/file'

export const command = 'create <scope>'

export const desc = 'Updates the semantic version'

export const builder = {
  scope: {
    alias: 's',
    type: 'string',
    default: undefined,
    choices: ['major', 'minor', 'patch'],
    describe: 'Identifies which semantic version value to update',
    demandOption: true
  },
  language: {
    alias: 'l',
    type: 'string',
    default: undefined,
    choices: ['csharp'],
    describe: 'Development language that the version information file is written in'
  },
  file: {
    alias: 'f',
    type: 'string',
    default: undefined,
    describe: 'File path containing version number to update'
  },
  tagPrefix: {
    type: 'string',
    default: '',
    describe: 'Prefix to add to the version number when creating the git tag'
  }
}

export function handler (argv) {
  const opts = loadOptions(argv)

  const versionUpdater = require(`../languages/${opts.language}`)
  if (!versionUpdater) {
    throw new Error('No matching version updater found')
  }

  const fileContent = fileHelper.readText(opts.file)

  const result = versionUpdater.updateVersion(opts.scope, fileContent)

  if (result.newVersionNumber && result.content) {
    fileHelper.writeFile(opts.file, result.content)

    execSync(`git add ${opts.file}`)
    execSync(`git commit -m "${result.newVersionNumber}"`)
    execSync(`git tag ${opts.tagPrefix || ''}${result.newVersionNumber}`)

    console.log(`Version number changed from ${result.oldVersionNumber} to ${result.newVersionNumber}`)
  }
}

function loadOptions (argv) {
  var optPath = path.resolve('./gatewayVersion.json')
  console.log(`Opts path is: ${optPath}`)
  let opts = fileHelper.readJson(optPath) || {}

  if (argv.scope) {
    opts.scope = argv.scope
  }

  if (argv.language) {
    opts.language = argv.language
  }

  if (argv.file) {
    opts.file = argv.file
  }

  if (argv.tagPrefix) {
    opts.tagPrefix = argv.tagPrefix
  }

  if (typeof opts.tagPrefix !== 'string') {
    opts.tagPrefix = ''
  }

  console.log(JSON.stringify(opts, null, 2))

  if (!opts.scope) {
    throw new Error('scope is required')
  }

  if (!opts.language) {
    throw new Error('language is required')
  }

  if (!opts.file) {
    throw new Error('file is required')
  }

  if (!fs.existsSync(opts.file)) {
    throw new Error('Version information file does not exist')
  }

  return opts
}
