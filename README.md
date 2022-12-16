# Express Actuator

[![npm version](https://img.shields.io/npm/v/express-actuator.svg?style=flat)](https://badge.fury.io/js/express-actuator)
[![Build Status](https://travis-ci.org/rcruzper/express-actuator.svg?branch=master)](https://travis-ci.org/rcruzper/express-actuator)
[![Coverage Status](https://coveralls.io/repos/github/rcruzper/express-actuator/badge.svg?branch=master)](https://coveralls.io/github/rcruzper/express-actuator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/express-actuator/badge.svg)](https://snyk.io/test/npm/express-actuator)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/express-actuator)](https://libraries.io/npm/express-actuator)
[![npm](https://img.shields.io/npm/dm/express-actuator)](https://www.npmjs.com/package/express-actuator)

This middleware creates a series of endpoints to help you monitor and manage your application when it's pushed to production. It's useful when you run your application on kubernetes and you are in need of endpoints for [readiness/liveness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) probe.

It is based on [Spring Boot Actuator](http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#production-ready) and the [healthcheck-ping](https://github.com/holidaycheck/healthcheck-ping) module by Mathias Schreck.

Table of Contents
=================

<!-- toc -->

- [Express Actuator](#express-actuator)
- [Table of Contents](#table-of-contents)
  - [Endpoints](#endpoints)
  - [Installation](#installation)
      - [Typescript](#typescript)
  - [Usage](#usage)
  - [Configuring Actuator](#configuring-actuator)
    - [Custom Endpoints](#custom-endpoints)
    - [Deprecated mode](#deprecated-mode)
  - [Endpoints Examples](#endpoints-examples)
    - [info](#info)
    - [metrics](#metrics)
    - [health](#health)
  - [Application Information](#application-information)
    - [Git Commit Information](#git-commit-information)
  - [Contributing](#contributing)

<!-- tocstop -->

## Endpoints

ID | Description
--- | ---
`info` | Displays application information.
`metrics` | Shows metrics information for the current application.
`health` | Shows application health information.

## Installation

```bash
$ npm install --save express-actuator
```

#### Typescript
```bash
$ npm install --save-dev @types/express-actuator
```

## Usage

```js
const actuator = require('express-actuator');
const app = express();

app.use(actuator());
```

## Configuring Actuator
All defined options are optional:

```js
const options = {
    basePath: '/management', // It will set /management/info instead of /info
    infoGitMode: 'simple', // the amount of git information you want to expose, 'simple' or 'full',
    infoBuildOptions: null, // extra information you want to expose in the build object. Requires an object.
    infoDateFormat: null, // by default, git.commit.time will show as is defined in git.properties. If infoDateFormat is defined, moment will format git.commit.time. See https://momentjs.com/docs/#/displaying/format/.
    customEndpoints: [] // array of custom endpoints
};

app.use(actuator(options));
```
### Custom Endpoints
You can add your own validations using the `customEndpoints` option:

```js
const options = {
    customEndpoints: [
        {
            id: 'dependencies', // used as endpoint /dependencies or ${basePath}/dependencies
            controller: (req, res) => { // Controller to be called when accessing this endpoint
                // Your custom code here
            }
        }
    ]
};

app.use(actuator(options));
```
> **_IMPORTANT:_**
>1. If you call your custom endpoint `info` it **WILL** override the default info.
>2. If you provide `basePath`, your id will be available as `${basePath}/${id}`, otherwise, just `/${id}`.
>3. Consider lightweight code being processed by your endpoint controller or it will compete with your main application.

### Deprecated mode
To have backward compatibility with previous versions (<= 1.2.0) the legacy way is still available:

```js
app.use(actuator('/management')); // It will set /management/info instead of /info
```

> **_IMPORTANT:_** Deprecated mode will be removed in the next major version.

## Endpoints Examples
### info
```json
{
    "build": {
        "description": "This is my new app",
        "name": "MyApp",
        "version": "1.0.0"
    },
    "git": {
        "branch": "master",
        "commit": {
            "id": "329a314",
            "time": "2016-11-18 08:16:39-0500"
        }
    }
}
```
> **_IMPORTANT:_** To get this information the middleware have some sort of logic:
>1. When the express app is executed with ```node app.js``` or ```npm start``` the module will look for a file named package.json where the node command was launched.
>2. Git information will show only if exists a ```git.properties``` file where the app was launched. You can use [node-git-info](https://www.npmjs.com/package/node-git-info) to generate this file.

### metrics
```json
{
    "mem": {
        "heapTotal": 14659584,
        "heapUsed": 10615072,
        "rss": 30093312
    },
    "uptime": 19.797
}
```

### health
```json
{
  "status": "UP"
}
```

## Application Information
### Git Commit Information
The info endpoint has a feature to publish information about your git source code repository. If a git.properties file is available on your project path, the git.branch, git.commit.id, and git.commit.time properties are exposed.

> **_TIP:_** You can use [node-git-info](https://www.npmjs.com/package/node-git-info) to generate git.properties file on your project.

If you want to display the full git information (that is, the full content of git.properties), use the infoGitMode property, as follows:

```js
const options = {
    infoGitMode: 'full'
};

app.use(actuator(options));
```

## Contributing

Third-party contributions are welcome! 🙏🏼 See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step instructions.

If you need help or have a question, let me know via a GitHub issue.
