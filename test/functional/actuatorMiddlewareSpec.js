'use strict';

var supertest = require('supertest-as-promised'),
    express = require('express'),
    server = express(),
    actuatorMiddleware = require('../../lib/actuatorMiddleware')();

server.use(actuatorMiddleware);

describe('actuator middleware', function () {
    var request = supertest(server);

    it('/info should return ok', function () {
        return request.get('/info')
            .expect(200, {
                build: {
                    description: 'Express Actuator provides monitoring endpoints based on Spring Boot Actuator and the healthcheck-ping module by Mathias Schreck',
                    name: 'express-actuator',
                    version: '1.0.1'
                }
            });
    });

    it('/metrics should return ok', function () {
        return request.get('/metrics')
            .expect(200);
    });
});
