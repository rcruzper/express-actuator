'use strict'

const request = require('supertest')
const express = require('express')
const expect = require('chai').expect
const actuator = require('../../lib')

let app

describe('GET /health', function () {
  function makeRequest (_app, done) {
    request(_app)
      .get('/health')
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
    app.use(actuator())
  })

  it('should return status UP', function (done) {
    makeRequest(app, done)
  })
})
