const jwt = require('jsonwebtoken');
const User = require('../models/users');

const validarJWT = async (req, res, next) => {

	const token = req.header('x-token')

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la peticion!'
		})
	}

	try{

		const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY )

		req.uid = uid
		req.user = await User.findById(req.uid)

		next()


	}catch(err){
		console.log(err);
		res.status(401).json({
			msg: 'Token invalido!'
		})
	}

}

module.exports = {
	validarJWT
}