module.exports = function() {
	return function(err, req, res, next) {

		console.error( next && err.stack );

		if ( req.body && req.body.txn_id ) {
			console.error('txn_id:', req.body.txn_id);
		}
		if ( req.body && req.body.payer_email ) {
			console.error('payer_email:', req.body.payer_email);
		}
		if ( req.body && req.body.hoodie && req.body.hoodie.email ) {
			console.error('username:', req.body.hoodie.email);
		}

		if ( +res.statusCode < 400 ) {
			res.statusCode = 500;
		}

		res.writeHead(res.statusCode, err.message.split('\n')[0], {
			'content-type': 'application/json'
		});

		return res.end(JSON.stringify({
			error: err.message,
			txn_id: req.body && req.body.txn_id,
			payer_email: req.body && req.body.payer_email,
			username: req.body && req.body.hoodie && req.body.hoodie.email
		}));
	};
};