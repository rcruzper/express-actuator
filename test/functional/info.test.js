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
        mock.restore();
    });

    it('should return build when package.json exists and git.properties doesn\'t', function(done) {
        mock({
            './package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}'
        });

        request(app)
            .get('/info')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(res.body.build.name).to.equal("testName");
                expect(res.body.build.description).to.equal("testDescription");
                expect(res.body.build.version).to.equal("1.0.0");
                expect(res.body.git).to.be.undefined;
                done();
            });
    });

    it('should not return build when package.json does not exist', function(done) {
        // The behaviour of a package.json empty is the same as if file doesn't exists
        mock({
            'package.json': ''
        });

        request(app)
            .get('/info')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(res.body.build).to.be.undefined;
                expect(res.body.git).to.be.undefined;
                done();
            });
    });

    it('should return build and git when package.json and git.properties exists', function(done) {
        mock({
            'package.json': '{"name":"testName","description":"testDescription","version":"1.0.0"}',
            'git.properties': "git.branch=master\ngit.commit.id.abbrev=1a24c24\ngit.commit.time=2016-11-18T13:16:39.000Z"
        });

        request(app)
            .get('/info')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(res.body.build.name).to.equal("testName");
                expect(res.body.build.description).to.equal("testDescription");
                expect(res.body.build.version).to.equal("1.0.0");
                expect(res.body.git.branch).to.equal('master');
                expect(res.body.git.commit.id).to.equal('1a24c24');
                expect(res.body.git.commit.time).to.equal(1479474999000);
                done();
            });
    });

});
