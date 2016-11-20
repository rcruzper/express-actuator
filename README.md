# Express Actuator

[![npm version](https://img.shields.io/npm/v/express-actuator.svg?style=flat)](https://badge.fury.io/js/express-actuator)
[![Build Status](https://travis-ci.org/rcruzper/express-actuator.svg?branch=master)](https://travis-ci.org/rcruzper/express-actuator)
[![Coverage Status](https://coveralls.io/repos/github/rcruzper/express-actuator/badge.svg?branch=master)](https://coveralls.io/github/rcruzper/express-actuator?branch=master)
[![Dependencies Status](https://david-dm.org/rcruzper/express-actuator/dev-status.svg)](https://david-dm.org/rcruzper/express-actuator/dev-status)

This middleware creates a series of endpoints to help you monitor and manage your application when it's pushed to production.

It is based on [Spring Boot Actuator](http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#production-ready) and the [healthcheck-ping](https://github.com/holidaycheck/healthcheck-ping) module by Mathias Schreck.

## Endpoints

These are the endpoints available:

- /info - Displays application information.
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
    IMPORTANT: To get this information the middleware have some sort of logic:
    1. If the express app is executed with ```npm start``` it will get the data from process.env
    2. If the express app is executed with ```node app.js``` the module will look for a file named package.json where the node command was launched.
    3. Git information will show only if exists a ```git-properties``` file where the app was launched. You can use [node-git-info](https://www.npmjs.com/package/node-git-info) to generate this file.


- /metrics - Shows ‘metrics’ information for the current application.
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

## Installation

```bash
$ npm install express-actuator --save
```

## Usage

```js
var actuator = require('express-actuator');

var app = express();

app.use(actuator());
```

If you want the endpoints to be available on a custom endpoint you can do so:

```js
app.use(actuator('/management')); // It will set /management/info instead of /info
```
