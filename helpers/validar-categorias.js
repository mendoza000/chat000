const Categoria = require('../models/categoria');

const validarCategoria = async (categoria) => {
	const existCategoria = await Categoria.findById({categoria})
    if (!existCategoria) {
        throw new Error(`La categoria ${categoria} no existe en la base de datos!`)
    }
}

const validarCategoriaForName = async (req, res, next) => {

    const {categoria} = req.body

    const name = categoria.toUpperCase()

    const categoriaExist = await Categoria.findOne({name})
 
    if (!categoriaExist) {
        return res.status(400).json({
            msg: "No existe una categoria con ese nombre!"
        })
    }

    req.categoria = categoriaExist

    next()


}


module.exports = {
	validarCategoria,
    validarCategoriaForName
}