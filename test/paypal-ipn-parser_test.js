var request = require('supertest'),
	connect = require('connect'),
	qs = require('qs'),
	pip = require('../lib/paypal-ipn-parser'),
	el = require('../lib/error-logger');

var app = connect()
		.use(pip())
		.use(el())
		.use(function(req, res) {
			res.writeHead(200, {
				'content-type': 'application/json'
			});
			res.end(JSON.stringify(req.body));
		});

exports.testValidQuery = function(test) {
	test.expect(6);

	request(app)
		.post('/?' + qs.stringify({
			email: 'zob@gmail.com',
			password: '123456',
			baseurl: 'test.thatsh.it'
		}))
		.send(qs.stringify({
			txn_id: '#987654',
			payer_email: 'job@gmail.com'
		}))
		.end(function(err, res) {

			test.equal(res.status, 200);

			test.equal(res.body.payer_email, 'job@gmail.com');
			test.equal(res.body.txn_id, '#987654');
			test.equal(res.body.hoodie.email, 'zob@gmail.com');
			test.equal(res.body.hoodie.password, '123456');
			test.equal(res.body.hoodie.baseurl, 'test.thatsh.it');

			test.done();
		});
};

exports.testInvalidQuery = function(test) {
	test.expect(2);

	request(app)
		.post('/')
		.send(qs.stringify({
			txn_id: '#987654',
			payer_email: 'job@gmail.com'
		}))
		.end(function(err, res) {
			test.equal(res.status, 500);
			test.equal(res.body.error.split('\n')[0], 'Request incomplete');

			test.done();
		});
};