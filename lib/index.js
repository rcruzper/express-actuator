'use strict';

const express = require('express');
const Info = require('./endpoints/info');
const Metrics = require('./endpoints/metrics');
const Health = require('./endpoints/health');

const defaults = {
    basePath: '',
    infoGitMode: 'simple'
};

module.exports = function actuatorMiddleware(options) {
    const router = express.Router();

    const opts = sanitize(options);

    router.get(opts.basePath + '/info', new Info(opts.infoGitMode).route);
    router.get(opts.basePath + '/metrics', new Metrics().route);
    router.get(opts.basePath + '/health', new Health().route);

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
