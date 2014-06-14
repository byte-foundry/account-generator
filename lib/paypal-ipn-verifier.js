var https = require('https');

var SANDBOX_URL = 'www.sandbox.paypal.com',
	REGULAR_URL = 'www.paypal.com';

module.exports = function() {
	return function(req, res, next) {
		var body = req.raw + '&cmd=_notify-validate',
			options = {
				host: req.body.test_ipn ? SANDBOX_URL : REGULAR_URL,
				method: 'POST',
				path: '/cgi-bin/webscr',
				headers: { 'content-length': body.length }
			},
			verifReq = https.request(options, function(verifRes) {
				var buffer = [];

				verifRes.on('data', function( data ) {
					buffer.push(data);
				});

				verifRes.on('end', function() {
					if ( buffer.join('') === 'VERIFIED' || ( process.env.DEV && req.body.debug_verify ) ) {
						return next();

					} else {
						res.statusCode = verifRes.statusCode;
						return next(new Error('Paypal ipn verification failed\n' + buffer.join()));
					}
				});

			});

		verifReq.on('error', function(err) {
			console.error(err);
		});

		verifReq.end(body);
	};
};