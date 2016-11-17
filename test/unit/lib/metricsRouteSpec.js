'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    metricsRoute = require('../../../lib/metricsRoute');

chai.use(sinonChai);

describe('metrics route', function () {
    var response;

    beforeEach(function () {
        response = {
            status: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
    });

    it('should send status code 200', function () {
        metricsRoute(null, response);

        expect(response.status).to.have.been.calledOnce;
        expect(response.status).to.have.been.calledWithExactly(200);
    });

    it('should flush the response sending', function () {
        metricsRoute(null, response);

        expect(response.end).to.have.been.calledOnce;
        expect(response.end).to.have.been.calledWithExactly();
    });
});
