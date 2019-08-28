'use strict';

const express = require('express');
const infoRoute = require('./infoRoute');
const metricsRoute = require('./metricsRoute');
const healthRoute = require('./healthRoute');

module.exports = function actuatorMiddleware(basePath) {
    const router = express.Router();

    const basePathSanitized = sanitize(basePath);

    router.get(basePathSanitized + '/info', infoRoute);
    router.get(basePathSanitized + '/metrics', metricsRoute);
    router.get(basePathSanitized + '/health', healthRoute);

    return router;
};

function sanitize(basePath) {
    let basePathSanitized = basePath;

    if (basePath === undefined) {
        basePathSanitized = '';
    }
    else if (basePath === '') {
        basePathSanitized = basePath;
    }

    return basePathSanitized;
}
