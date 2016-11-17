'use strict';

var pkgjson = require(process.cwd() + '/package.json');

module.exports = function info(req, res) {
    res.status(200).json({
        build: {
            name: pkgjson.name,
            description: pkgjson.description,
            version: pkgjson.version
        }
    }).end();
};
