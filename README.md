# Express Actuator

[![npm version](https://img.shields.io/npm/v/express-actuator.svg?style=flat)](https://badge.fury.io/js/express-actuator)
[![Build Status](https://travis-ci.org/rcruzper/express-actuator.svg?branch=master)](https://travis-ci.org/rcruzper/express-actuator)
[![Coverage Status](https://coveralls.io/repos/github/rcruzper/express-actuator/badge.svg?branch=master)](https://coveralls.io/github/rcruzper/express-actuator?branch=master)
[![Dependencies Status](https://david-dm.org/rcruzper/express-actuator/dev-status.svg)](https://david-dm.org/rcruzper/express-actuator/dev-status)

This middleware creates a series of endpoints to help you monitor and manage your application when it's pushed to production.

It is based on [Spring Boot Actuator](http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#production-ready) and the [healthcheck-ping](https://github.com/holidaycheck/healthcheck-ping) module by Mathias Schreck.

## Endpoints

These are the actual endpoints available:

| Path  	| Description                                              	|
|----------	|----------------------------------------------------------	|
| /info    	| Displays application info                                	|
| /metrics 	| Shows ‘metrics’ information for the current application. 	|

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
