'use strict';

var fs = require('fs');

var env = process.env;

module.exports = function info(req, res) {
    if (env != null) {
        var packageName = env.npm_package_name;
        var packageDescription = env.npm_package_description;
        var packageVersion = env.npm_package_version;
    }
    else {
        var pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

        packageName = pkgjson.name;
        packageDescription = pkgjson.description;
        packageVersion = pkgjson.version;
    }

    res.status(200).json({
        build: {
            name: packageName,
            description: packageDescription,
            version: packageVersion
        }
    }).end();
};
