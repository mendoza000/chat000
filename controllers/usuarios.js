const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/users');

const usuariosGet = async (req = request, res = response) => {

	const { limit = 5, from = 0 } = req.query
	const options = {status: true}

	const [total, users] = await Promise.all([
	        User.countDocuments(options),
	        User.find(options)
				.skip(parseInt(from))
				.limit(parseInt(limit))
	    ])

	res.json({
		total,
		users
	});



}

const usuariosPost = async (req, res = response) => {

	let {name, pass, role, mail} = req.body;
	const user = new User({name, pass, role, mail})

	// Encriptar la pass
	const salt = bcryptjs.genSaltSync()
	user.pass = bcryptjs.hashSync( pass, salt)

	// Guarda en la DB
	await user.save()

	res.json(user);
}

const usuariosPut = async (req, res = response) => {

	const { id } = req.params;
	let { pass, google, mail, _id, ...resto } = req.body

	if (pass){
		// Encriptar la pass
		const salt = bcryptjs.genSaltSync()
		resto.pass = bcryptjs.hashSync( pass, salt)
	}

	// Validar contra la base de datos
	const user = await User.findByIdAndUpdate(id, resto)


	res.json(user);
}

const usuariosPatch = (req, res = response) => {

	res.json({
		msg: "pathc"
	});
}

const usuariosDelete = async (req, res = response) => {
	const {id} = req.params
	const option = { status: false }

	const [userDelete] = await Promise.all([
	        User.findByIdAndUpdate(id, option)
	    ])
	const userByDelete = req.user

	res.json({
		msg: "User status delete",
		userDelete,
		userByDelete
	});
}




module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
}