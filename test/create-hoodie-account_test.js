var request = require('supertest'),
	connect = require('connect'),
	qs = require('qs'),
	pip = require('../lib/paypal-ipn-parser'),
	piv = require('../lib/paypal-ipn-verifier'),
	cha = require('../lib/create-hoodie-account'),
	el = require('../lib/error-logger');

var app = connect()
		.use(pip())
		.use(piv())
		.use(cha())
		.use(el())
		.use(function(req, res) {
			res.writeHead(200);
			res.end();
		});

var email = 'lrbabe+test' + Math.round(Math.random() * 1E6) + '@gmail.com',
	baseurl = 'http://prototypo.cloudapp.net';

exports.testCreationSucceded = function(test) {
	test.expect(1);

	request(app)
		.post('/?' + qs.stringify({
			email: email,
			password: '123456',
			baseurl: baseurl
		}))
		.send(qs.stringify({
			test_ipn: 1,
			debug_verify: 1,
			txn_id: '#987654',
			payer_email: 'job@gmail.com'
		}))
		.end(function(err, res) {
			test.equal(res.status, 200);

			test.done();
		});
};

exports.testDuplicateUsername = function(test) {
	test.expect(2);

	request(app)
		.post('/?' + qs.stringify({
			email: email,
			password: '123456',
			baseurl: baseurl
		}))
		.send(qs.stringify({
			test_ipn: 1,
			debug_verify: 1,
			txn_id: '#987654',
			payer_email: 'job@gmail.com'
		}))
		.end(function(err, res) {

			test.equal(res.status, 202);
			test.equal(res.body.error.split('\n')[0], 'Account creation failed');

			test.done();
		});
};