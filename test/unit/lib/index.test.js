'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const express = require('express');
const Info = require('../../../lib/endpoints/info');
const Health = require('../../../lib/endpoints/health');
const actuator = require('../../../lib');

chai.use(require('sinon-chai'));

describe('actuator middleware', function () {
    let router;

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
        let infoRouter = actuator();

        expect(infoRouter).to.equal(router);
        expect(express.Router).to.have.been.calledOnce;
    });

    it('should mount the info route on the default endpoint', function () {
        actuator();

        expect(router.get).to.have.been.calledThrice;
        expect(router.get).to.have.been.calledWithExactly('/info', new Info().route);
    });

    it('should mount the info route on the given endpoint', function () {
        actuator('/foobar');

        expect(router.get).to.have.been.calledThrice;
        expect(router.get).to.have.been.calledWithExactly('/foobar/info', new Info().route);
    });

    it('should mount the health route on the given endpoint when options is set', function () {
        actuator({basePath: "/management"});

        expect(router.get).to.have.been.calledWithExactly('/management/health', new Health().route);
    });

    it('should mount the health route on the given endpoint when options has unknown data', function () {
        actuator({unknownData: "/test"});

        expect(router.get).to.have.been.calledWithExactly('/health', new Health().route);
    });
});
