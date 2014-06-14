var AWS = require('aws-sdk'),
	ses = new AWS.SES();

module.exports = function() {
	return function(err, req, res, next) {
		if ( ( req.body && req.body.hoodie && req.body.hoodie.email ) || req.body.payer_email ) {
			ses.sendEmail({
				Destination: { // required
					ToAddresses: [ ( req.body && req.body.hoodie && req.body.hoodie.email ) || req.body.payer_email ]
				},
				Message: { // required
					Body: { // required
						Text: {
							Data:
								'Hello,\n\n' +
								'Paypal informed us about your payment but for some reason the account creation failed. ' +
								'We wanted to let you know that we are aware of this problem and working on it.\n' +
								'We will get back to you as soon as we have more information. ' +
								'In the meantime you won\'t be able to log into the app.\n\n' +
								'Sorry for the inconvenience,\n' +
								'From the Prototypo Team', // required
							Charset: 'UTF-8',
						},
					},
					Subject: { // required
						Data: 'Your Prototypo account couldn\'t be created', // required
						Charset: 'UTF-8',
					},
				},
				Source: 'support@prototypo.io', // required
			}, function(err) {
				if (err) {
					console.error(err);
				}
			});
		}

		ses.sendEmail({
			Destination: { // required
				ToAddresses: ['lrb@prototypo.io']
			},
			Message: { // required
				Body: { // required
					Text: {
						Data:
							'Hi there,\n\n' +
							'We received an IPN from Paypal but an error occured and the account couldn\'t be created. ' +
							'Here\'s what we know:\n' +
							'Transaction ID: ' + ( req.body && req.body.txn_id || '' ) + '\n' +
							'Payer email: ' + ( req.body && req.body.payer_email || '' ) + '\n' +
							'username: ' + ( req.body && req.body.hoodie && req.body.hoodie.email || '' ) + '\n' +
							'Error:' + err.message,
						Charset: 'UTF-8',
					},
				},
				Subject: { // required
					Data: 'Holly Molly, an account creation failed', // required
					Charset: 'UTF-8',
				},
			},
			Source: 'support@prototypo.io', // required
		}, function(err) {
			if (err) {
				console.error(err);
			}
		});

		next(err);
	};
};