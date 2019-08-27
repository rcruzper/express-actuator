'use strict';

const httpMocks = require('node-mocks-http');
const expect = require('chai').expect;

const metrics = require('../../../lib/metricsRoute.js');

describe('metrics route', function() {
    let mockRequest;
    let mockResponse;

    beforeEach(function() {
        mockRequest = httpMocks.createRequest({
            method: "GET",
            url: "/metrics"
        });
        mockResponse = httpMocks.createResponse();
    });

    it('should return 200', function(done) {
        metrics(mockRequest, mockResponse);
        expect(mockResponse.statusCode).to.equal(200);

        done();
    });

    it('should return application/json', function(done) {
        metrics(mockRequest, mockResponse);
        expect(mockResponse.getHeader('Content-Type')).to.equal('application/json');

        done();
    });

    it('should return json response', function(done) {
        metrics(mockRequest, mockResponse);

        const res = mockResponse._getJSONData();
        expect(res.mem.external).to.be.a("number");
        expect(res.mem.heapTotal).to.be.a("number");
        expect(res.mem.heapUsed).to.be.a("number");
        expect(res.mem.rss).to.be.a("number");
        expect(res.uptime).to.be.a('number');

        done();
    })
});
