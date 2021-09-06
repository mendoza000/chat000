const path = require('path');
const {v4: uuid} = require('uuid')

const validarExtension = ( ...params ) => {
	return (req, res, next) => {

		if (!params) {
			return res.status(500).json({
				msg: 'No se han establecido las extensiones permitidas, hable con el administrador.'
			})
		}

		const { file } = req.files;

		const nameCortado = file.name.split('.')
		const extension = nameCortado[ nameCortado.length - 1]

		if (!params.includes(extension)) {
			return res.status(400).json({
				msg: 'Ese tipo de archivo no esta permitido!',
				permitidas: params
			})
		}

		req.extension = extension;
		next()

	}

}

const validarExistFile = (req, res, next) => {

	if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
		res.status(400).json({msg: 'No hay archivos para subir.'});
	    return;
	}

	next()

} 

const crearNameFile = (req, res, next) => {

	req.tempNameFile = `${uuid()}.${req.extension}`
	next()
}

const validarCollection = (...params) => {

	return (req, res, next) => {
		const {collection} = req.params

		if (!params.includes(collection)) {
			return res.status(400).json({
				msg: 'Esa colecion no es permitida!',
				permitidas: params
			})
		}

		next()
	}
}

const guardarFile = (req, res, next) => {

	const {file} = req.files
	const {collection} = req.params
	let carpeta = ''
	
	if (!collection) {
		carpeta = 'imgs'
	} else{
		carpeta = collection
	}

	const uploadPath = path.join(__dirname, `../uploads/${carpeta}/` + req.tempNameFile);

	file.mv(uploadPath, (err) => {
		if (err) {
			console.log(err);
			return res.status(500).json({err});
		}
	});

	req.uploadPath = uploadPath

	next()

}

module.exports = {
	validarExtension,
	validarExistFile,
	crearNameFile,
	validarCollection,
	guardarFile
}

