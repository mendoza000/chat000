const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLECLIENTID )

const googleVerify = async (idToken) => {

	const ticket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLECLIENTID
	})
	const payload = ticket.getPayload()
	console.log(payload);
	return payload
}

module.exports = googleVerify