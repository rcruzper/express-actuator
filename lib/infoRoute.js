'use strict';

const fs = require('fs');
const properties = require('utils-fs-read-properties');
const moment = require('moment');

module.exports = function info(req, res) {
    const build = getBuild();
    const git = getGit();

    res.status(200).json({
        build: build,
        git: git
    });
};

function getBuild() {
    let packageJson;
    try {
        const packageFile = fs.readFileSync('./package.json', 'utf8');
        packageJson = JSON.parse(packageFile);
    } catch (err) {
        // Error getting and parsing package.json
    }

    let build;
    if (packageJson !== undefined) {
        build = {
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version
        }
    }

    return build;
}

function getGit() {
    let git;

    const data = properties.sync('git.properties');
    if (!(data instanceof Error)) {
        git = {
            branch: data['git.branch'],
            commit: {
                id: data['git.commit.id.abbrev'],
                time: moment(data['git.commit.time'], moment.ISO_8601).valueOf()
            }
        }
    }

    return git;
}
