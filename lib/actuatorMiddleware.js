'use strict';

var express = require('express');
var infoRoute = require('./infoRoute');
var metricsRoute = require('./metricsRoute');

module.exports = function actuatorMiddleware(endpoint) {
    var router = express.Router();

    var infoPath = '/info';
    var metricsPath = '/metrics';

    if (endpoint) {
        infoPath = endpoint + infoPath;
        metricsPath = endpoint + metricsPath;
    }

    router.get(infoPath, infoRoute);
    router.get(metricsPath, metricsRoute);

    return router;
};
