# Express Actuator

[![npm version](https://img.shields.io/npm/v/express-actuator.svg?style=flat)](https://badge.fury.io/js/express-actuator)
[![Build Status](https://travis-ci.org/rcruzper/express-actuator.svg?branch=master)](https://travis-ci.org/rcruzper/express-actuator)
[![Coverage Status](https://coveralls.io/repos/github/rcruzper/express-actuator/badge.svg?branch=master)](https://coveralls.io/github/rcruzper/express-actuator?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/express-actuator/badge.svg)](https://snyk.io/test/npm/express-actuator)
[![Dependencies Status](https://david-dm.org/rcruzper/express-actuator.svg)](https://david-dm.org/rcruzper/express-actuator)

This middleware creates a series of endpoints to help you monitor and manage your application when it's pushed to production. It's useful when you run your application on kubernetes and you are in need of endpoints for [readiness/liveness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) probe.

It is based on [Spring Boot Actuator](http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#production-ready) and the [healthcheck-ping](https://github.com/holidaycheck/healthcheck-ping) module by Mathias Schreck.

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

## Usage

```js
const actuator = require('express-actuator');
const app = express();

app.use(actuator());
```

## Configuring Actuator

```js
const options = {
    basePath: '/management' // It will set /management/info instead of /info
};

app.use(actuator(options));
```

### Deprecated mode
To have backward compatibility with previous versions (<= 1.2.0) the legacy way is still available:

```js
app.use(actuator('/management')); // It will set /management/info instead of /info
```

> **_IMPORTANT:_** Deprecated mode will be removed in the next major version.

## Request Examples
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
            "time": 1478086940000
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
