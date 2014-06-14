var request = require('superagent');

var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
	radix = chars.length;

// helper to generate unique ids.
function generateId (length) {
	var id = '';

	// default uuid length to 7
	if (length === undefined) {
		length = 7;
	}

	for (var i = 0; i < length; i++) {
		var rand = Math.random() * radix;
		var char = chars[Math.floor(rand)];
		id += String(char).charAt(0);
	}

	return id;
}

module.exports = function() {
	return function(req, res, next) {
		var now = new Date(),
			id = generateId();

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
				database: 'user/' + id,
				hoodieId: id,
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
					return next(new Error('Account creation failed\n' + response.status + ' ' + response.text));
				}

				next();
			});
	};
};