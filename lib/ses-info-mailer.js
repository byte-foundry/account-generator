var AWS = require('aws-sdk'),
	ses = new AWS.SES();

module.exports = function() {
	return function(req, res) {
		ses.sendEmail({
			Destination: { // required
				ToAddresses: [req.body.payer_email]
			},
			Message: { // required
				Body: { // required
					Text: {
						Data:
							'Hello,\n\n' +
							'Your account has been successfully created.\n' +
							'You can now login and try the development version of Prototypo\n' +
							'http://dev.prototypo.io\n\n' +
							'Thanks to your support, we will keep improving it and let you know when new features are available.\n' +
							'Best regards,\n' +
							'The team', // required
						Charset: 'UTF-8',
					},
				},
				Subject: { // required
					Data: 'Welcome to Prototypo (Development Version)', // required
					Charset: 'UTF-8',
				},
			},
			Source: 'support@prototypo.io', // required
		}, function(err) {
			if (err) {
				console.error(err);
			}
		});

		res.end();
	};
};