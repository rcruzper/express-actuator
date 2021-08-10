'use strict'

const util = require('util')
const express = require('express')
const Info = require('./endpoints/info')
const Metrics = require('./endpoints/metrics')
const Health = require('./endpoints/health')
const Cache = require('./utils/cache')

const defaults = {
  basePath: '',
  infoGitMode: 'simple',
  infoDateFormat: null,
  infoBuildTime: null,
  customEndpoints: []
}

module.exports = function actuatorMiddleware (options) {
  const router = express.Router()

  const opts = sanitize(options)

  const cache = new Cache()

  if (!customEndpointExists('/info', opts.customEndpoints)) {
    const info = new Info(
      {
        gitMode: opts.infoGitMode,
        dateFormat: opts.infoDateFormat,
        buildOptions: opts.infoBuildOptions
      },
      cache)

    router.get(opts.basePath + '/info', info.route)
  }

  if (!customEndpointExists('/metrics', opts.customEndpoints)) {
    router.get(opts.basePath + '/metrics', new Metrics().route)
  }

  if (!customEndpointExists('/health', opts.customEndpoints)) {
    router.get(opts.basePath + '/health', new Health().route)
  }

  opts.customEndpoints.forEach(function (endpoint) {
    router.get(opts.basePath + endpoint.id, endpoint.controller)
  })

  return router
}

const customEndpointExists = (id, customEndpoints) => {
  return customEndpoints.filter(endpoint => endpoint.id === id).length > 0
}

const sanitizeStringOption = util.deprecate((options) => {
  return {
    basePath: options,
    customEndpoints: []
  }
}, '[express-actuator] Parameter must be an object. Support for string will be removed in the next major release.')

function sanitize (options) {
  if (options !== undefined && typeof options === 'string') {
    return sanitizeStringOption(options)
  }

  const opts = Object.assign({}, defaults, options)

  opts.customEndpoints = opts.customEndpoints.map(function (endpoint) {
    endpoint.id = endpoint.id[0] === '/' ? endpoint.id : `/${endpoint.id}`
    return endpoint
  })

  return opts
}
