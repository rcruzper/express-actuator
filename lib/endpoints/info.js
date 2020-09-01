'use strict'

const fs = require('fs')
const properties = require('utils-fs-read-properties')
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
  let git

  const data = properties.sync('git.properties')
  if (!(data instanceof Error)) {
    const time = dateFormat
      ? moment(data['git.commit.time']).format(dateFormat)
      : data['git.commit.time']

    if (infoGitMode === 'simple') {
      git = {
        branch: data['git.branch'],
        commit: {
          id: data['git.commit.id.abbrev'],
          time
        }
      }
    } else if (infoGitMode === 'full') {
      git = {
        branch: data['git.branch'],
        commit: {
          id: data['git.commit.id.abbrev'],
          idFull: data['git.commit.id'],
          time,
          user: {
            email: data['git.commit.user.email'],
            name: data['git.commit.user.name']
          },
          message: {
            full: data['git.commit.message.full'],
            short: data['git.commit.message.short']
          }
        }
      }
    }
  }

  return git
}
