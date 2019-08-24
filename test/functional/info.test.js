'use strict';

const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const actuator = require('../../lib/actuatorMiddleware.js');
const mock = require('mock-fs');

let app;

describe('GET /info', function() {
    beforeEach(function() {
       app = express();
       app.use(actuator());
    });

    afterEach(function() {
        app.close;
    });

    // TODO: the validation should be against a package.json mocked
    it('should return build when package.json exists', function(done) {
        request(app)
            .get('/info')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                expect(res.body.build.name).to.equal("express-actuator");
                expect(res.body.build.description).to.equal("Express Actuator provides monitoring endpoints based on Spring Boot Actuator and the healthcheck-ping module by Mathias Schreck");
                expect(res.body.build.version).to.be.a("string");
                expect(res.body.git).to.be.undefined;
                done();
            });
    });

    it('should not return build when package.json does not exist');

    // TODO: activate again once a way to test with different/mock files
    xit('should return build and git when package.json and git.properties exists', function(done) {
        mock({
            'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
            'git.properties': "{git.branch=master\ngit.commit.id=1324324\ngit.commit.time=1478086940000}"
        });

        request(app)
            .get('/info')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                expect(res.body.build.name).to.equal("testName");
                expect(res.body.build.description).to.equal("testDescription");
                expect(res.body.build.version).to.equal("1.0.0");
                // expect(res.body.git.branch).to.equal('master');
                // expect(res.body.git.commit.id).to.equal('1324324');
                // expect(res.body.git.commit.time).to.equal('1478086940000');
                done();
            });
    });

});
