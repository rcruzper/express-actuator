'use strict';

const express = require('express');
const Info = require('./infoRoute');
const metricsRoute = require('./metricsRoute');
const healthRoute = require('./healthRoute');

const defaults = {
    basePath: '',
    infoGitMode: 'simple'
};

module.exports = function actuatorMiddleware(options) {
    const router = express.Router();

    const opts = sanitize(options);

    router.get(opts.basePath + '/info', new Info(opts.infoGitMode).route);
    router.get(opts.basePath + '/metrics', metricsRoute);
    router.get(opts.basePath + '/health', healthRoute);

    return router;
};

function sanitize(options) {
    let opts;

    if (options !== undefined && typeof options === 'string') {
        opts = {
            basePath: options
        }
    }
    else {
        opts = Object.assign({}, defaults, options);
    }

    return opts;
}
