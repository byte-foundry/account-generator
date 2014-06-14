var request = require('superagent');

module.exports = function() {
	return function(req, res, next) {
		var now = new Date();

		request
			.put(
				req.body.hoodie.baseurl +
				'/_api/_users/org.couchdb.user%3Auser%2F' +
				encodeURIComponent(req.body.hoodie.email)
			)
			.set('content-type', 'application/json')
			.set('Accept', 'application/json')
			.send({
				_id: 'org.couchdb.user:user/' + req.body.hoodie.email,
				name: 'user/' + req.body.hoodie.email,
				password: req.body.hoodie.password,
				type: "user",
				roles: [],
				createdAt: now,
				signedUpAt: now,
				updatedAt: now
			})
			.end(function(response) {
				if ( response.status >= 400 ) {
					res.statusCode = response.status;
					return next(new Error('Account creation failed\n' + response.text));
				}

				next();
			});
	};
};