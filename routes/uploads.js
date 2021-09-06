const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const { uploadFiles, updateFile, mostrarImg, updateFileCloudinary } = require('../controllers/uploads');
const {validarExtension, 
        validarExistFile, 
        crearNameFile, 
        validarCollection,
        guardarFile
    } = require('../middlewares/validar-file');

let x

const router = Router();

router.post('/', [
    validarExistFile,
    validarExtension('img', 'png', 'jpg', 'jpeg'),
    crearNameFile,
    guardarFile,
    validarCampos
], uploadFiles)

router.put('/:collection/:id', [
    validarCollection('users', 'products'),
    check('id', 'El id es invalido!').isMongoId(),
    validarExistFile,
    validarExtension('png', 'jpg', 'jpeg'),
    crearNameFile,
    guardarFile,
    validarCampos
], updateFileCloudinary)

router.get('/:collection/:id', [
    validarCollection('users', 'products'),
    check('id', 'El id es invalido!').isMongoId(),
    validarCampos
], mostrarImg)

module.exports = router