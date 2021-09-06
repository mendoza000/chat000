const Product = require('../models/producto');


const getProductos = async (req, res) => {

	const { limit = 5, from = 0 } = req.query
	const options = {status: true}

	const [total, products] = await Promise.all([
	        Product.countDocuments(options),
	        Product.find(options)
				.skip(parseInt(from))
				.limit(parseInt(limit))
	    ])

	res.json({
		total,
		products
	});

}

const getProductoForID = async (req, res) => {

	const {id} = req.params

	const product = await Product.findById(id)

	res.json(product)

}

const createProducto = async (req, res) => {

	const { name, price, description, stonks} = req.body

	const data = {
		name,
		price,
		categoria: req.categoria.name,
		by: req.user._id,
		description,
		stonks
	}

	const producto = new Product(data)

	await producto.save()

	res.status(201).json(producto)

}
const updateProducto = async (req, res) => {

	const {id} = req.params
	const {name, categoria, price, description, stonks} = req.body

	if (description === null) { description = req.product.description }
	if (stonks === null) { stonks = req.product.stonks }
	if (categoria === null) { stonks = req.product.categoria }
	if (price === null) { stonks = req.product.price }

	const data = {
		name,
		categoria,
		price,
		by: req.user._id,
		description,
		stonks
	}

	const producto = await Product.findByIdAndUpdate(id, data)

	res.json(producto)

}

const deleteProducto = async (req, res) => {

	const {id} = req.params

	const productDelete = await Product.findByIdAndUpdate(id, {status: false})

	res.json({
		msg: "Eliminado con exito",
		productDelete
	})

}

module.exports = {
	getProductos,
	getProductoForID, 
	createProducto,
	updateProducto,
	deleteProducto
}