'use strict';

var supertest = require('supertest-as-promised');
var express = require('express');
var server = express();
var expect = require('chai').expect;
var mock = require('mock-fs');

var actuatorMiddleware = require('../../lib/actuatorMiddleware')();

server.use(actuatorMiddleware);

describe('when /info', function () {
    var request = supertest(server);

    it('should return only build', function (done) {
        request.get('/info')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body.build.name).to.not.be.null,
                expect(res.body.build.description).to.not.be.null,
                expect(res.body.build.version).to.not.be.null,
                expect(res.body.git).to.not.exist
            });

        done();
    });

    it('should return build and git when git.properties exists', function (done) {
        mock({
          'git.properties': "{git.branch=master\ngit.commit.id=1324324\ngit.commit.time=1478086940000}"
        });

        request.get('/info')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body.build.name).to.not.be.null,
                expect(res.body.build.description).to.not.be.null,
                expect(res.body.build.version).to.not.be.null,
                expect(res.body.git.branch).to.equal('master'),
                expect(res.body.git.commit.id).to.equal('1324324'),
                expect(res.body.git.commit.time).to.equal('1478086940000')
            })

        mock.restore();

        done();
    });

    it('/metrics should return ok', function (done) {
        request.get('/metrics')
            .expect(200);

        done();
    });
});
