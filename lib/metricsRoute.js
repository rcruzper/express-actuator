'use strict';

module.exports = function metrics(req, res) {
    res.status(200).json({
        mem: process.memoryUsage(),
        uptime: process.uptime()
    }).end();
};
