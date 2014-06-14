var getRawBody = require('raw-body'),
	qs = require('qs'),
	url = require('url');

module.exports = function() {
	return function(req, res, next) {
		getRawBody(req, {
			length: req.headers['content-length'],
			limit: '1mb',
			encoding: 'utf8'
		}, function (err, raw) {
			if (err) {
				return next(new Error('Paypal ipn parsing errored'));
			}

			req.raw = raw;
			req.body = qs.parse( raw );

			// account params are included in the request url
			var params = url.parse( req.url, true ).query,
				errors = [];

			if ( !req.body.txn_id ) {
				errors.push('txn_id missing');
			}
			if ( !req.body.payer_email ) {
				errors.push('payer_email missing');
			}
			if ( !params.email ) {
				errors.push('hoodie email missing');
			}
			if ( !params.password ) {
				errors.push('password missing');
			}
			if ( !params.baseurl ) {
				errors.push('baseurl missing');
			}

			if ( errors.length ) {
				return next(new Error('Request incomplete\n' + errors.join(', ')));
			}

			req.body.hoodie = {
				email: params.email,
				password: params.password,
				baseurl: params.baseurl
			};

			next();
		});
	};
};