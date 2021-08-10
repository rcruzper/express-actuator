'use strict'

const assert = require('assert').strict
const Cache = require('../../../lib/utils/cache')

describe('cache should', function () {
  let cache

  beforeEach(function () {
    cache = new Cache()
  })

  it('set the value in the cache', function () {
    cache.set('key', 'value')

    assert.equal(cache.get('key'), 'value')
  })

  it('return undefined if key is not found', function () {
    assert.equal(cache.get('key'), undefined)
  })
})
