const Categoria = require('../models/categoria');

const categoriasGet = async(req, res) => {

	try{
		const { limit = 5, from = 0 } = req.query
		const options = {status: true}

		const [total, categorias] = await Promise.all([
		        Categoria.countDocuments(options),
		        Categoria.find(options)
					.skip(parseInt(from))
					.limit(parseInt(limit))
		    ])

		res.json({
			total,
			categorias
		});

	}catch(err){
		console.log(err);
		res.status(500).json({
			msg: "Error de red o de backend"
		})
	}


}

const categoriasForId = async (req, res) => {

	const id = req.params.id

	const categoria = await Categoria.findById(id)

	if (!categoria) {
		return res.status(400).json({
			msg: `No existe ninguna categoria con el id: ${id}`
		})
	}

	res.json(categoria)
}

const createCategoria = async (req, res) => {

	try{
		const name = req.body.name.toUpperCase()

		const categoriaInDB = await Categoria.findOne({name})

		if (categoriaInDB) {
			return res.status(400).json({
				msg: 'Ya existe una categoria con ese nombre'
			})
		}

		const data = {
			name,
			by: req.user._id
		}

		const categoria = new Categoria(data)

		await categoria.save()

		res.status(201).json({
			categoria
		})

	}catch(err){
		res.status(500).json({
			msg: 'Error de red o en el backend'
		})
	}
}

const deleteCategoria = async (req, res) => {

	const {id} = req.params
	const options = {status: false}

	const categoria = await Categoria.findByIdAndUpdate(id, options)

	res.json(categoria)
}

const updateCategoria = async (req, res) => {

	const {name} = req.body
	const {id} = req.params

	const categoria = await Categoria.findByIdAndUpdate(id, {name})

	res.json(categoria)
}

module.exports = {
	categoriasGet,
	categoriasForId,
	createCategoria,
	deleteCategoria,
	updateCategoria
}
