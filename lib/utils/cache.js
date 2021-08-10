'use strict'

let data

class Cache {
  constructor () {
    data = {}
  }

  set (key, value) {
    data[key] = value
  }

  get (key) {
    return data[key]
  }
}

module.exports = Cache
