const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

	return new Promise( (res, rej) => {

		const payload = { uid }

		jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
			expiresIn: '8h'
		}, (err, token) => {

			if (err) {

				console.log(err);
				rej('No se pudo generar el token')

			}else{

				res(token)

			}
		})

	})

}

module.exports = generarJWT