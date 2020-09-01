'use strict'

const request = require('supertest')
const express = require('express')
const expect = require('chai').expect
const actuator = require('../../lib')

let app

describe('GET /metrics', function () {
  beforeEach(function () {
    app = express()
    app.use(actuator())
  })

  it('should return metrics', function (done) {
    request(app)
      .get('/metrics')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.mem.external).to.be.a('number')
        expect(res.body.mem.heapTotal).to.be.a('number')
        expect(res.body.mem.heapUsed).to.be.a('number')
        expect(res.body.mem.rss).to.be.a('number')
        expect(res.body.uptime).to.be.a('number')
        done()
      })
  })
})
