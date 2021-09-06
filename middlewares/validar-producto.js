const Product = require('../models/producto');

const validarProduct = async (req, res, next) => {

	const {name} = req.body

	const product = await Product.findOne({name})
 
	if (product) {
		return res.status(400).json({
			msg: "Ya existe un producto con ese nombre!"
		})
	}

	next()

}

const validarProductNotExist = async (req, res, next) => {

	const {id} = req.params

	const product = await Product.findById(id)
 
	if (!product) {
		return res.status(400).json({
			msg: "No existe un producto con ese id!"
		})
	}

	req.product = product

	next()

}



module.exports = {validarProduct, validarProductNotExist}