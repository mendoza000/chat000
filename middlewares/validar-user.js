const User = require('../models/users');

const validarUser = async(req, res, next) => {

	const userByDelete = await User.findById(req.uid ) 

	if (!userByDelete) {
		return res.status(500).json({
			msg: "Se quiere validar el usuario sin primero verificar el token."
		})
	}

	/*if (userByDelete.role.includes("ADMIN_ROLE", "SELLER")) {
		return res.status(401).json({
			msg: "Usted no es un administrador."
		})
	}
*/
	if (!userByDelete.status) {
		return res.status(401).json({
			msg: "Su usuario esta desactivado."
		})
	}

	next()

}

const validarRole = (...roles) => {

	return(req, res, next) => {

		if (!req.user) {
			return res.status(500).json({
				msg: "Se quiere validar el rol sin primero verificar el token."
			})
		}

		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
			msg:`Esta peticion requiere algunos roles => ${roles}.`
		})
		}

		next()

	}


}

module.exports = {
	validarUser,
	validarRole
}