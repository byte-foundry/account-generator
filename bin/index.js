#!/usr/bin/env node
var colors = require('colors'),
	http = require('http'),
	connect = require('connect'),
	pip = require('../lib/paypal-ipn-parser'),
	piv = require('../lib/paypal-ipn-verifier'),
	cha = require('../lib/create-hoodie-account'),
	sim = require('../lib/ses-info-mailer'),
	sem = require('../lib/ses-error-mailer'),
	el = require('../lib/error-logger');

var port = process.env.PORT,
	host = process.env.HOST,
	app = connect()
		.use(pip())
		.use(piv())
		.use(cha())
		.use(sem())
		.use(el())
		.use(sim());

http.createServer(app).listen(port, host);

colors.setTheme({}); // use colors to prevent jshint complaints
console.log('endpoint ' + 'started '.green.bold + 'on port '.blue + port.yellow);