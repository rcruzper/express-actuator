'use strict';

const fs = require('fs');
const properties = require('utils-fs-read-properties');
const moment = require('moment');

let gitMode;
let dateFormat;

class Info {
    constructor(infoGitMode, infoDateFormat) {
        gitMode = infoGitMode;
        dateFormat = infoDateFormat;
    }
    route(req, res) {
        const build = getBuild();
        const git = getGit(gitMode, dateFormat);

        res.status(200).json({
            build: build,
            git: git
        });
    }
}

module.exports = Info;

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

function getGit(infoGitMode, dateFormat) {
    let git;

    const data = properties.sync('git.properties');
    if (!(data instanceof Error)) {
        let time = dateFormat
            ? moment(data['git.commit.time']).format(dateFormat)
            : data['git.commit.time'];

        if (infoGitMode === 'simple') {
            git = {
                branch: data['git.branch'],
                commit: {
                    id: data['git.commit.id.abbrev'],
                    time
                }
            };
        }
        else if (infoGitMode === 'full') {
            git = {
                branch: data['git.branch'],
                commit: {
                    id: data['git.commit.id.abbrev'],
                    idFull: data['git.commit.id'],
                    time,
                    user: {
                        email: data['git.commit.user.email'],
                        name: data['git.commit.user.name']
                    },
                    message: {
                        full: data['git.commit.message.full'],
                        short: data['git.commit.message.short']
                    }
                }
            };
        }
    }

    return git;
}
