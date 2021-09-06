const bcryptjs = require('bcryptjs');

const User = require('../models/users');
const generarJWT = require('../helpers/generar-jwt');
const googleVerify = require('../helpers/google-verify');

const authLogin = async(req, res) => {

	const { pass, mail } = req.body

	try{
		/* Confirmamos si el usuario existe */
		const user = await User.findOne({mail})
		if (!user) {
			return res.status(400).json({
				msg: "El mail / pass no existe en la base de datos."
			})
		}

		/* Confirmamos si el usuario esta activo */
		if (!user.status) {
			return res.status(400).json({
				msg: "El usuario ya no esta activo."
			})
		}

		/* Confirmamos si la contraseña es correcta */
		const validPass = bcryptjs.compareSync(pass, user.pass)
		if (!validPass) {
			return res.status(400).json({
				msg: "La contraseña es incorrecta."
			})
		}

		/* Generar JWT */
		const token = await generarJWT(user.id)


		res.json({
			msg: "Inicio de sesion exitoso!",
			user,
			token
		})


	}catch(error){
		console.log(error);
		res.status(500).json({
			error: "Error en el backend, comuniquese con el dev :/"
		})
	}
}

const googleSingin = async (req, res) => {
	const { id_token } = req.body

	try{
		const {name, email: mail, picture: img} = await googleVerify(id_token)
		let user = await User.findOne({mail})

		if (!user) {
			const data = {
				name,
				mail,
				img,
				google: true,
				pass: ':D'
			}

			user = new User(data)
			await user.save()
		}

		if (!user.status) {
			return res.status(401).json({
				msg: "Usuario bloqueado, hable con el admin!"
			})
		}

		/* Generar JWT */
		const token = await generarJWT(user.id)

		res.json({
			user,
			token
		})
	}catch(err){
		res.status(400).json({
			msg: "El token de google es invalido!"
		})
	}

}

const getAuthUser = async (req, res) => {

	if (!req.user) {
		return res.status(400).json({
			msg: 'No existe ningun usuario con ese token'
		})

	}
	const user = req.user
	res.json({
		user
	})

}

module.exports = {
	authLogin,
	googleSingin,
	getAuthUser
}