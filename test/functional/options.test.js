'use strict';

const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const actuator = require('../../lib/actuatorMiddleware.js');

let app;

describe('request basePath within options', function() {

    beforeEach(function () {
        app = express();
    });

    afterEach(function () {
        app.close;
    });

    it('should return 200 when options has basePath set', function(done) {
        const options = {
            basePath: "/management"
        };

        app.use(actuator(options));

        request(app)
            .get('/management/health')
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(res.body.status).to.equal("UP");
                done();
            });
    });

    it('should return 200 when options has unknown data', function(done) {
        const options = {
            unknownData: "data"
        };

        app.use(actuator(options));

        request(app)
            .get('/health')
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(res.body.status).to.equal("UP");
                done();
            });
    });

});
