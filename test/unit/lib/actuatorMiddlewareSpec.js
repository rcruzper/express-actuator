'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    express = require('express'),
    infoRoute = require('../../../lib/infoRoute'),
    actuatorMiddleware = require('../../../lib/actuatorMiddleware');

chai.use(require('sinon-chai'));

describe('actuator middleware', function () {
    var router;

    beforeEach(function () {
        router = {
            get: sinon.stub().returnsThis()
        };

        sinon.stub(express, 'Router').returns(router);
    });

    afterEach(function () {
        express.Router.restore();
    });

    it('should create a new router', function () {
        var infoRouter = actuatorMiddleware();

        expect(infoRouter).to.equal(router);
        expect(express.Router).to.have.been.calledOnce;
    });

    it('should mount the info route on the default endpoint', function () {
        actuatorMiddleware();

        expect(router.get).to.have.been.calledTwice;
        expect(router.get).to.have.been.calledWithExactly('/info', infoRoute);
    });

    it('should mount the info route on the given endpoint', function () {
        actuatorMiddleware('/foobar');

        expect(router.get).to.have.been.calledTwice;
        expect(router.get).to.have.been.calledWithExactly('/foobar/info', infoRoute);
    });
});
