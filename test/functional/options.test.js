'use strict'

const request = require('supertest')
const express = require('express')
const expect = require('chai').expect
const actuator = require('../../lib')

let app

describe('request basePath within options', function () {
  const makeRequest = function (path, done) {
    request(app)
      .get(path)
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.status).to.equal('UP')
        done()
      })
  }

  beforeEach(function () {
    app = express()
  })

  it('should return 200 when options has basePath set', function (done) {
    const options = {
      basePath: '/management'
    }

    app.use(actuator(options))
    makeRequest('/management/health', done)
  })

  it('should return 200 when options has unknown data', function (done) {
    const options = {
      unknownData: 'data'
    }

    app.use(actuator(options))
    makeRequest('/health', done)
  })
})
