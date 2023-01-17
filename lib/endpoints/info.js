'use strict'

const fs = require('fs')
const propertiesReader = require('properties-reader')
const dayjs = require('dayjs')

let gitMode
let dateFormat
let buildOptions
let cache

class Info {
  constructor (options = {}, contextCache) {
    gitMode = options.gitMode
    dateFormat = options.dateFormat
    buildOptions = options.buildOptions
    cache = contextCache
  }

  route (req, res) {
    const build = getBuild(buildOptions)
    const git = getGit(gitMode, dateFormat)

    res.status(200).json({
      build,
      git
    })
  }
}

module.exports = Info

function getBuild (options) {
  const packageJson = getPackageJsonFile()

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

function getPackageJsonFile () {
  let packageJson = cache.get('packageJson')
  if (packageJson === undefined) {
    try {
      const packageFile = fs.readFileSync('./package.json', 'utf8')
      packageJson = JSON.parse(packageFile)
      cache.set('packageJson', packageJson)
    } catch (err) {
      // Error getting and parsing package.json
    }
  }
  return packageJson
}

function getGit (infoGitMode, dateFormat) {
  const properties = getGitFile()
  let git

  if (properties !== undefined) {
    const time = dateFormat
      ? dayjs(properties.get('git.commit.time')).format(dateFormat)
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

function getGitFile () {
  let properties = cache.get('properties')
  if (properties === undefined) {
    try {
      properties = propertiesReader('git.properties')
      cache.set('properties', properties)
    } catch (error) {
      // do nothing
    }
  }
  return properties
}
