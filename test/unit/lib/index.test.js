'use strict'

const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
const express = require('express')
const Info = require('../../../lib/endpoints/info')
const Metrics = require('../../../lib/endpoints/metrics')
const Health = require('../../../lib/endpoints/health')
const actuator = require('../../../lib')

chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))

describe('actuator middleware', function () {
  let router

  beforeEach(function () {
    router = {
      get: sinon.stub().returnsThis()
    }

    sinon.stub(express, 'Router').returns(router)
  })

  afterEach(function () {
    express.Router.restore()
  })

  it('should create a new router', function () {
    const infoRouter = actuator()

    expect(infoRouter).to.equal(router)
    expect(express.Router).to.have.been.calledOnce()
  })

  it('should mount the info route on the default endpoint', function () {
    actuator()

    expect(router.get).to.have.been.calledThrice()
    expect(router.get).to.have.been.calledWithExactly('/info', new Info().route)
  })

  it('should mount the info route on the given endpoint', function () {
    actuator('/foobar')

    expect(router.get).to.have.been.calledThrice()
    expect(router.get).to.have.been.calledWithExactly('/foobar/info', new Info().route)
  })

  it('should mount the health route on the given endpoint when options is set', function () {
    actuator({ basePath: '/management' })

    expect(router.get).to.have.been.calledWithExactly('/management/health', new Health().route)
  })

  it('should mount the health route on the given endpoint when options has unknown data', function () {
    actuator({ unknownData: '/test' })

    expect(router.get).to.have.been.calledWithExactly('/health', new Health().route)
  })

  it('should register a custom endpoint when received in options', function () {
    const controller = function () {
    }
    actuator({
      customEndpoints: [
        {
          id: '/test',
          controller: controller
        }
      ]
    })

    expect(router.get).to.have.been.calledWithExactly('/health', new Health().route)
    expect(router.get).to.have.been.calledWithExactly('/test', controller)
  })

  it('should register a custom endpoint for info instead of the original', function () {
    const controller = function () {}

    actuator({
      customEndpoints: [
        {
          id: '/info',
          controller: controller
        }
      ]
    })

    expect(router.get).to.have.been.calledWithExactly('/info', controller)
    expect(router.get).to.have.been.not.calledWithExactly('/info', new Info().route)
  })

  it('should register a custom endpoint fixing the path for info instead of the original', function () {
    const controller = function () {}

    actuator({
      customEndpoints: [
        {
          id: 'info',
          controller: controller
        }
      ]
    })

    expect(router.get).to.have.been.calledWithExactly('/info', controller)
    expect(router.get).to.have.been.not.calledWithExactly('/info', new Info().route)
  })

  it('should register a custom endpoint for metrics instead of the original', function () {
    const controller = function () {}

    actuator({
      customEndpoints: [
        {
          id: '/metrics',
          controller: controller
        }
      ]
    })

    expect(router.get).to.have.been.calledWithExactly('/metrics', controller)
    expect(router.get).to.have.been.not.calledWithExactly('/metrics', new Metrics().route)
  })

  it('should register a custom endpoint for health instead of the original', function () {
    const controller = function () {}

    actuator({
      customEndpoints: [
        {
          id: '/health',
          controller: controller
        }
      ]
    })

    expect(router.get).to.have.been.calledWithExactly('/health', controller)
    expect(router.get).to.have.been.not.calledWithExactly('/health', new Health().route)
  })

  it('should register a custom endpoint fixing the path received in options', function () {
    const controller = function () {
    }
    actuator({
      customEndpoints: [
        {
          id: 'test',
          controller: controller
        }
      ]
    })

    expect(router.get).to.have.been.calledWithExactly('/test', controller)
  })
})
