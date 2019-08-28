'use strict';

var express = require('express');
var infoRoute = require('./infoRoute');
var metricsRoute = require('./metricsRoute');
var healthRoute = require('./healthRoute');

module.exports = function actuatorMiddleware(endpoint) {
    var router = express.Router();

    var infoPath = '/info';
    var metricsPath = '/metrics';
    var healthPath = "/health";

    if (endpoint) {
        infoPath = endpoint + infoPath;
        metricsPath = endpoint + metricsPath;
        healthPath = endpoint + healthPath;
    }

    router.get(infoPath, infoRoute);
    router.get(metricsPath, metricsRoute);
    router.get(healthPath, healthRoute);

    return router;
};
