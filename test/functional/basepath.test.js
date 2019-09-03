'use strict';

const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const actuator = require('../../lib/actuatorMiddleware.js');

let app;

describe('basePath', function() {

    describe('disabled', function() {
        beforeEach(function () {
            app = express();
            app.use(actuator());
        });

        afterEach(function () {
            app.close;
        });

        it('should return 200 when basePath not requested', function (done) {
            request(app)
                .get('/health')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                    expect(res.body.status).to.equal("UP");
                    done();
                });
        });

        it('should return 404 when basePath requested', function (done) {
            request(app)
                .get('/management/health')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    done();
                });
        });
    });

    describe('enabled', function() {
        beforeEach(function () {
            app = express();
            app.use(actuator('/management'));
        });

        afterEach(function () {
            app.close;
        });

        it('should return 200 when basePath requested', function (done) {
            request(app)
                .get('/management/health')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                    expect(res.body.status).to.equal("UP");
                    done();
                });
        });

        it('should return 404 when basePath not requested', function (done) {
            request(app)
                .get('/health')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    done();
                });
        });

        it('should return 200 when basePath is empty', function (done) {
            app.use(actuator(''));
            request(app)
                .get('/health')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                    expect(res.body.status).to.equal("UP");
                    done();
                });
        });

        it('should return 200 when basePath doesn\'t have slash', function (done) {
            app.use(actuator('management'));
            request(app)
                .get('/management/health')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                    expect(res.body.status).to.equal("UP");
                    done();
                });
        });
    });
});
