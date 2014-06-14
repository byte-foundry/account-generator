var request = require('supertest'),
	connect = require('connect'),
	qs = require('qs'),
	pip = require('../lib/paypal-ipn-parser'),
	piv = require('../lib/paypal-ipn-verifier'),
	el = require('../lib/error-logger');

var app = connect()
		.use(pip())
		.use(piv())
		.use(el())
		.use(function(req, res) {
			res.writeHead(200);
			res.end();
		});

exports.testVerificationFailed = function(test) {
	test.expect(2);

	request(app)
		.post('/?' + qs.stringify({
			email: 'zob@gmail.com',
			password: '123456',
			baseurl: 'test.thatsh.it'
		}))
		.send(qs.stringify({
			test_ipn: 1,
			txn_id: '#987654',
			payer_email: 'job@gmail.com'
		}))
		.end(function(err, res) {
			test.equal(res.status, 202);
			test.equal(res.body.error.split('\n')[0], 'Paypal ipn verification failed');
			test.done();
		});
};

exports.testVerificationSucceded = function(test) {
	test.expect(1);

	request(app)
		.post('/?' + qs.stringify({
			email: 'zob@gmail.com',
			password: '123456',
			baseurl: 'test.thatsh.it'
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
