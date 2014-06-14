var request = require('supertest'),
	connect = require('connect'),
	qs = require('qs'),
	pip = require('../lib/paypal-ipn-parser'),
	piv = require('../lib/paypal-ipn-verifier'),
	cha = require('../lib/create-hoodie-account'),
	sim = require('../lib/ses-info-mailer'),
	sem = require('../lib/ses-error-mailer'),
	el = require('../lib/error-logger');

var app = connect()
		.use(pip())
		.use(piv())
		.use(cha())
		.use(sem())
		.use(el())
		.use(sim());

var email = 'lrbabe+test' + Math.round(Math.random() * 1E6) + '@gmail.com',
	baseurl = 'http://prototypo.cloudapp.net';

exports.testErrorMailer = function(test) {
	test.expect(1);

	request(app)
		.post('/')
		.send(qs.stringify({
			txn_id: '#987654',
			payer_email: 'lrbabe+failed@gmail.com'
		}))
		.end(function(err, res) {
			test.equal(res.status, 500);

			test.done();
		});
};

exports.testSuccessMailer = function(test) {
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
			payer_email: 'lrbabe+payer@gmail.com'
		}))
		.end(function(err, res) {
			test.equal(res.status, 200);

			test.done();
		});
};