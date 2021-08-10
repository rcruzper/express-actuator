'use strict'

const request = require('supertest')
const express = require('express')
const chai = require('chai')
const expect = chai.expect
const actuator = require('../../lib')
const mock = require('mock-fs')

chai.use(require('dirty-chai'))

let app

describe('GET /info', function () {
  beforeEach(function () {
    app = express()
    app.use(actuator())
  })

  afterEach(function () {
    mock.restore()
  })

  it('should return build when package.json exists and git.properties doesn\'t', function (done) {
    mock({
      './package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}'
    })

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git).to.be.undefined()
        done()
      })
  })

  it('should not return build when package.json does not exist', function (done) {
    // The behaviour of a package.json empty is the same as if file doesn't exists
    mock({
      'package.json': ''
    })

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build).to.be.undefined()
        expect(res.body.git).to.be.undefined()
        done()
      })
  })

  it('should return build and git when package.json and git.properties exists', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
      'git.properties': 'git.branch=master\ngit.commit.id.abbrev=1a24c24\ngit.commit.time=2016-11-18T13:16:39.000Z'
    })

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git.branch).to.equal('master')
        expect(res.body.git.commit.id).to.equal('1a24c24')
        expect(res.body.git.commit.time).to.equal('2016-11-18T13:16:39.000Z')
        done()
      })
  })

  it('should return the same response using the cache', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
      'git.properties': 'git.branch=master\ngit.commit.id.abbrev=1a24c24\ngit.commit.time=2016-11-18T13:16:39.000Z'
    })

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git.branch).to.equal('master')
        expect(res.body.git.commit.id).to.equal('1a24c24')
        expect(res.body.git.commit.time).to.equal('2016-11-18T13:16:39.000Z')
      })

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git.branch).to.equal('master')
        expect(res.body.git.commit.id).to.equal('1a24c24')
        expect(res.body.git.commit.time).to.equal('2016-11-18T13:16:39.000Z')
        done()
      })
  })

  it('should return commit.id as string when short commit id has an e', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
      'git.properties': 'git.branch=master\ngit.commit.id.abbrev=296e115\ngit.commit.time=2016-11-18T13:16:39.000Z'
    })

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git.branch).to.equal('master')
        expect(res.body.git.commit.id).to.equal('296e115')
        expect(res.body.git.commit.time).to.equal('2016-11-18T13:16:39.000Z')
        done()
      })
  })
})

describe('GET /info with infoGitMode', function () {
  beforeEach(function () {
    app = express()
  })

  afterEach(function () {
    mock.restore()
  })

  it('should return git full information when infoGitMode is full', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
      'git.properties': 'git.commit.id.abbrev=296e115\n' +
                'git.commit.user.email=user@email.com\n' +
                'git.commit.message.full=first commit\n' +
                'git.commit.id=296e115fe6285fea65ba81ea39d71d5b75f9ade0\n' +
                'git.commit.message.short=first commit\n' +
                'git.commit.user.name=User Name\n' +
                'git.branch=master\n' +
                'git.commit.time=2016-11-18T13:16:39.000Z'
    })

    app.use(actuator({ infoGitMode: 'full' }))

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git.commit.id).to.equal('296e115')
        expect(res.body.git.commit.user.email).to.equal('user@email.com')
        expect(res.body.git.commit.message.full).to.equal('first commit')
        expect(res.body.git.commit.idFull).to.equal('296e115fe6285fea65ba81ea39d71d5b75f9ade0')
        expect(res.body.git.commit.message.short).to.equal('first commit')
        expect(res.body.git.commit.user.name).to.equal('User Name')
        expect(res.body.git.branch).to.equal('master')
        expect(res.body.git.commit.time).to.equal('2016-11-18T13:16:39.000Z')
        done()
      })
  })

  it('should not return git information when infoGitMode not exists', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
      'git.properties': 'git.commit.id.abbrev=296e115\n' +
        'git.commit.user.email=user@email.com\n' +
        'git.commit.message.full=first commit\n' +
        'git.commit.id=296e115fe6285fea65ba81ea39d71d5b75f9ade0\n' +
        'git.commit.message.short=first commit\n' +
        'git.commit.user.name=User Name\n' +
        'git.branch=master\n' +
        'git.commit.time=2016-11-18T13:16:39.000Z'
    })

    app.use(actuator({ infoGitMode: 'notexists' }))

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        done()
      })
  })
})

describe('GET /info with infoDateFormat', function () {
  beforeEach(function () {
    app = express()
  })

  afterEach(function () {
    mock.restore()
  })

  it('should return git time formatted when infoDateFormat is defined', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
      'git.properties': 'git.branch=master\ngit.commit.id.abbrev=1a24c24\ngit.commit.time=2016-11-18T13:16:39.000Z'
    })

    app.use(actuator({ infoDateFormat: 'YYYY-MM-DD' }))

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.git.branch).to.equal('master')
        expect(res.body.git.commit.id).to.equal('1a24c24')
        expect(res.body.git.commit.time).to.equal('2016-11-18')
        done()
      })
  })
})

describe('GET /info with infoBuildOptions', function () {
  beforeEach(function () {
    app = express()
  })

  afterEach(function () {
    mock.restore()
  })

  it('should return build with added infoBuildOptions information when defined', function (done) {
    mock({
      'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}'
    })

    app.use(actuator({
      infoBuildOptions: {
        test: 'test'
      }
    }))

    request(app)
      .get('/info')
      .end(function (err, res) {
        if (err) return err
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
        expect(res.body.build.name).to.equal('testName')
        expect(res.body.build.description).to.equal('testDescription')
        expect(res.body.build.version).to.equal('1.0.0')
        expect(res.body.build.test).to.equal('test')
        done()
      })
  })
})
