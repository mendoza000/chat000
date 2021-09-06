const {ObjectId} = require('mongoose').Types;

const Product = require('../models/producto');
const User = require('../models/users');
const Categoria = require('../models/categoria')

const collectionAvailables = [
	'users',
	'products',
	'categorias',
	'roles'
]

const searchUser = async (termino, res) =>{

	const isMongoID = ObjectId.isValid(termino)

	if (isMongoID) {

		const user = await User.findById(termino)

		return res.json({
			results: [ (user !== null) ? user : [] ]
		})

	}else{
		const regex = RegExp(termino, 'i')

		const [ users, total ] = await Promise.all([
		    User.find({
				$or: [{ name: regex }, { mail: regex }, { role: regex }],
				$and: [{ status: true }]
			}),
			User.count({
				$or: [{ name: regex }, { mail: regex }, { role: regex }],
				$and: [{ status: true }]
			})
		])
 
		return res.json({
			total,
			results: users
		})
	}

}

const searchCategoria = async (termino, res) => {

	const isMongoID = ObjectId.isValid(termino)

	if (isMongoID) {

		const categoria = await Categoria.findOne({ _id: termino, status: true })

		return res.json({
			results: [ (categoria !== null) ? categoria : [] ]
		})

	}

	const regex = RegExp(termino, 'i')
	const categorias = await Categoria.find({ name: regex, status: true })

	res.json({
		results: categorias
	})

}

const searchProducto = async (termino, res) => {

	const isMongoID = ObjectId.isValid(termino)

	if (isMongoID) {

		const producto = await Product.findOne({ _id: termino, status: true })

		return res.json({
			results: [ (producto !== null) ? producto : [] ]
		})

	}

	const regex = RegExp(termino, 'i')
	const productos = await Product.find({
		$or: [{ name: regex }, { categoria: regex }],
		$and: [{status: true}]
	})

	res.json({
		results: productos
	})

}

const searchGet = (req, res) => {

	const {collection, termino} = req.params

	if (!collectionAvailables.includes(collection)) {
		return res.status(400).json({
			msg: `Solo se permiten las siguientes colleciones: ${collectionAvailables}`
		})
	}

	switch(collection){

		case 'users':
			searchUser(termino, res)
		break;

		case 'products':
			searchProducto(termino, res)
		break;

		case 'categorias':
			searchCategoria(termino, res)
		break;

		default:
			res.status(500).json({
				msg: 'Aun no se ha añadido esa coleccion.'
			})
		break;

	}

}

module.exports = {
	searchGet
}