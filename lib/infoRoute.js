'use strict';

var fs = require('fs');
var read = require('utils-fs-read-properties');
var moment = require('moment');

// Just for rewire this variable in unit tests
var envPackageName = process.env.npm_package_name;

module.exports = function info(req, res) {
    if (envPackageName != null) {
        var packageName = process.env.npm_package_name;
        var packageDescription = process.env.npm_package_description;
        var packageVersion = process.env.npm_package_version;
    }
    else {
        var pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

        packageName = pkgjson.name;
        packageDescription = pkgjson.description;
        packageVersion = pkgjson.version;
    }

    var data = read.sync('git.properties');
    var git;
    if (!(data instanceof Error)) {
        git = {
            branch: data['git.branch'],
            commit: {
                id: data['git.commit.id.abbrev'],
                time: moment(data['git.commit.time'], moment.ISO_8601).valueOf()
            }
        }
    }

    res.status(200).json({
        build: {
            name: packageName,
            description: packageDescription,
            version: packageVersion
        },
        git: git
    }).end();
};
