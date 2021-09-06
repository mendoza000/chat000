const fs   = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');
cloudinary.config(process.env.CLOUDINARY_URL)

const Product = require('../models/producto')
const User = require('../models/users');

const uploadFiles = (req, res) => {

	res.json({msg: 'Archivo subido a: ' + req.tempNameFile});
}

const updateFile = async (req, res) => {

	let model;

	const {collection, id} = req.params

	switch(collection){
		case 'users':
			model = await User.findById(id)
			if (!model) {
				return res.status(400).json({
					msg: 'No existe ningun usuario con ese id ' + id
				})
			}

		break 

		case 'products':
			model = await Product.findById(id)
			if (!model) {
				return res.status(400).json({
					msg: 'No existe ningun producto con ese id ' + id
				})
			}

		break 

		default:
			return res.status(500).json({
				msg: 'se me olvido añadir esa colecion :p'
			})
	}

	/* Verificar si la imagen ya existe y si si, se elimina */
	try{
		if (model.img) {
			const imagePath = path.join(__dirname, '../uploads/', collection, model.img);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath)
			}
		}
	}catch(err){

		console.log(err);
		console.log('No se ha podido eliminar la imagen anterior!');

	}

	model.img = req.tempNameFile
	await model.save()

	res.json({
		model
	})

}

const updateFileCloudinary = async (req, res) => {

	let model;

	const {collection, id} = req.params

	switch(collection){
		case 'users':
			model = await User.findById(id)
			if (!model) {
				return res.status(400).json({
					msg: 'No existe ningun usuario con ese id ' + id
				})
			}

		break 

		case 'products':
			model = await Product.findById(id)
			if (!model) {
				return res.status(400).json({
					msg: 'No existe ningun producto con ese id ' + id
				})
			}

		break 

		default:
			return res.status(500).json({
				msg: 'se me olvido añadir esa colecion :p'
			})
	}

	/* Verificar si la imagen ya existe y si si, se elimina */
	try{
		if (model.img) {
			const nameArr = model.img.split('/')
			const name    = nameArr[ nameArr.length - 1 ]
			const [public_id] = name.split('.') 
			
			cloudinary.v2.uploader.destroy(public_id)
		}
	}catch(err){

		console.log(err);
		console.log('No se ha podido eliminar la imagen anterior!');

	}
	const {tempFilePath} = req.files.file
	 
	try{
		const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

		model.img = secure_url
		await model.save()

		return res.json({
			model
		})
	} catch(err){
		console.log('No se ha podido subir la imagen')
		return res.status(500).json({
			msg: 'No se pudo subir la imagen :p'
		})
	}

	

}

const mostrarImg = async (req, res) => {

	let model;

	const {collection, id} = req.params

	switch(collection){
		case 'users':
			model = await User.findById(id)
			if (!model) {
				return res.sendFile({
					msg: 'No existe ningun usuario con ese id ' + id
				})
			}

		break 

		case 'products':
			model = await Product.findById(id)
			if (!model) {
				return res.status(400).json({
					msg: 'No existe ningun producto con ese id ' + id
				})
			}

		break 

		default:
			return res.status(500).json({
				msg: 'se me olvido añadir esa colecion :p'
			})
	}

	/* Verificar si la imagen ya existe y si si, se elimina */
	try{
		if (model.img) {
			const imagePath = path.join(__dirname, '../uploads/', collection, model.img);
			if (fs.existsSync(imagePath)) {
				return res.sendFile(imagePath)
			}
		}
		const noImage = path.join(__dirname, '../uploads/noimage.jpg');
		return res.sendFile(noImage)
	}catch(err){
		
		console.log('No se ha podido eliminar la imagen anterior!');
		

	}

}

module.exports = {
	uploadFiles,
	updateFile,
	mostrarImg,
	updateFileCloudinary
}