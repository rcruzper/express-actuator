'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    infoRoute = require('../../../lib/infoRoute');
var rewire = require("rewire");

chai.use(sinonChai);

describe('info route', function () {
    var response;

    beforeEach(function () {
        response = {
            status: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
    });

    it('should send status code 200', function () {
        infoRoute(null, response);

        expect(response.status).to.have.been.calledOnce;
        expect(response.status).to.have.been.calledWithExactly(200);
    });

    it('should send a payload with all keys', function () {
        infoRoute(null, response);

        expect(response.json).to.have.been.calledOnce;
        expect(response.json).to.have.property('name');
    });

    it('should send a payload when process.env.npm_package_name does not exists', function () {
        var infoRouteRewire = rewire("../../../lib/infoRoute");
        infoRouteRewire.__set__("env", null);

        infoRouteRewire(null, response);

        expect(response.json).to.have.been.calledOnce;
        expect(response.json).to.have.property('name');
    });



    it('should flush the response sending', function () {
        infoRoute(null, response);

        expect(response.end).to.have.been.calledOnce;
        expect(response.end).to.have.been.calledWithExactly();
    });
});
