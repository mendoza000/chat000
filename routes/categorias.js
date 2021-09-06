const { Router } = require('express');
const { check } = require('express-validator');

const { categoriasGet, 
        createCategoria, 
        categoriasForId, 
        deleteCategoria,
        updateCategoria
    } = require('../controllers/categorias');
const {validarJWT} = require('../middlewares/validar-jwt')
const {validarCampos} = require('../middlewares/validar-campos');
const { validarCategoria } = require('../helpers/validar-categorias');
const {validarUser, validarRole} = require('../middlewares/validar-user');


const router = Router();

/* Obtener categoiras - publico*/
router.get('/', categoriasGet );

/* obtener categoria especifica - publico */
router.get('/:id',[
    check('id').isMongoId(),
    check('id').custom(validarCategoria),
], categoriasForId)

/* Crear categoria - admin */
router.post('/', [
    validarJWT,
    validarUser,
    validarRole('ADMIN_ROLE', 'SELLER_ROLE'),
    check('name', 'El name es requerido.').not().isEmpty(),
    validarCampos
],createCategoria)

/* Eliminar categoria - admin */
router.delete('/:id', [
    check('id').isMongoId(),
    check('id').custom(validarCategoria),
    validarJWT,
    validarUser,
    validarRole('ADMIN_ROLE', 'SELLER_ROLE'),
    validarCampos
],deleteCategoria)

/* Actualizar categoria */
router.put('/:id', [
    check('id').isMongoId(),
    check('id').custom(validarCategoria),
    check('name', 'El nombre es requerido').not().isEmpty(),
    validarJWT,
    validarUser,
    validarRole('ADMIN_ROLE', 'SELLER_ROLE'),
    validarCampos
],updateCategoria)




module.exports = router