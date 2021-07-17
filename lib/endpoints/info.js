'use strict'

const fs = require('fs')
const propertiesReader = require('properties-reader')
const moment = require('moment')

let gitMode
let dateFormat
let buildOptions

class Info {
  constructor (options = {}) {
    gitMode = options.gitMode
    dateFormat = options.dateFormat
    buildOptions = options.buildOptions
  }

  route (req, res) {
    const build = getBuild(buildOptions)
    const git = getGit(gitMode, dateFormat)

    res.status(200).json({
      build: build,
      git: git
    })
  }
}

module.exports = Info

function getBuild (options) {
  let packageJson
  try {
    const packageFile = fs.readFileSync('./package.json', 'utf8')
    packageJson = JSON.parse(packageFile)
  } catch (err) {
    // Error getting and parsing package.json
  }

  let build
  if (packageJson !== undefined) {
    build = Object.assign({
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version
    }, options === Object(options) ? options : {})
  }

  return build
}

function getGit (infoGitMode, dateFormat) {
  let properties
  try {
    properties = propertiesReader('git.properties')
  } catch (error) {
    // do nothing
  }

  let git

  if (properties !== undefined) {
    const time = dateFormat
      ? moment(properties.get('git.commit.time')).format(dateFormat)
      : properties.get('git.commit.time')

    if (infoGitMode === 'simple') {
      git = {
        branch: properties.get('git.branch'),
        commit: {
          id: properties.getRaw('git.commit.id.abbrev'),
          time
        }
      }
    } else if (infoGitMode === 'full') {
      git = {
        branch: properties.get('git.branch'),
        commit: {
          id: properties.getRaw('git.commit.id.abbrev'),
          idFull: properties.get('git.commit.id'),
          time,
          user: {
            email: properties.get('git.commit.user.email'),
            name: properties.get('git.commit.user.name')
          },
          message: {
            full: properties.get('git.commit.message.full'),
            short: properties.get('git.commit.message.short')
          }
        }
      }
    }
  }

  return git
}
