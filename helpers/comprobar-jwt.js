const jwt = require('jsonwebtoken');
const User = require('../models/users');

const comprobarJWT = async(token) => {

	try{

		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
		const user = User.findById(uid)

		if (!user) {
			return null;
		}

		return user
		

	}catch(err){
		return null
	}

}

module.exports = comprobarJWT