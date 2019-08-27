'use strict';

const httpMocks = require('node-mocks-http');
const expect = require('chai').expect;
const rewire = require("rewire");
const mock = require('mock-fs');
const info = rewire('../../../lib/infoRoute.js');

describe('info route', function() {
    let mockRequest;
    let mockResponse;

    beforeEach(function() {
        mockRequest = httpMocks.createRequest({
            method: "GET",
            url: "/info"
        });
        mockResponse = httpMocks.createResponse();
    });

    afterEach(function() {
        mock.restore();
    });

    it('should return 200', function(done) {
        info(mockRequest, mockResponse);
        expect(mockResponse.statusCode).to.equal(200);

        done();
    });

    it('should return application/json', function(done) {
        info(mockRequest, mockResponse);
        expect(mockResponse.getHeader('Content-Type')).to.equal('application/json');

        done();
    });

    it('should return build object when package.json exists', function(done) {
        info.__set__("envPackageName", null);
        mock({
            'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}'
        });

        info(mockRequest, mockResponse);

        const res = mockResponse._getJSONData();
        expect(res.build.name).to.equal("testName");
        expect(res.build.description).to.equal("testDescription");
        expect(res.build.version).to.equal("1.0.0");

        done();
    });

    it('should return build and git object when package.json and git.properties exists', function(done) {
        info.__set__("envPackageName", null);
        mock({
            'git.properties': "git.branch=master\ngit.commit.id.abbrev=1a24c24\ngit.commit.time=2016-11-18T13:16:39.000Z",
            'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}'
        });

        info(mockRequest, mockResponse);

        const res = mockResponse._getJSONData();
        expect(res.build.name).to.equal("testName");
        expect(res.build.description).to.equal("testDescription");
        expect(res.build.version).to.equal("1.0.0");
        expect(res.git.branch).to.equal('master');
        expect(res.git.commit.id).to.equal('1a24c24');
        expect(res.git.commit.time).to.equal(1479474999000);

        done();
    });


});
