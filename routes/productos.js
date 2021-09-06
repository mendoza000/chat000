const {Router} = require('express');
const {check}  = require('express-validator');

const { getProductos, 
		getProductoForID, 
		createProducto,
		updateProducto,
		deleteProducto
	} = require('../controllers/productos');
const {validarJWT} = require('../middlewares/validar-jwt')
const {validarCampos} = require('../middlewares/validar-campos');
const { validarCategoria, validarCategoriaForName} = require('../helpers/validar-categorias');
const {validarUser, validarRole} = require('../middlewares/validar-user');
const {validarProduct, validarProductNotExist} = require('../middlewares/validar-producto');

const router = Router()

/* Llamar productos - publico */
router.get('/', getProductos)

/* Llamar producto - publico */
router.get('/:id', [
    check('id').not().isEmpty(),
    check('id').isMongoId(),
    validarCampos
], getProductoForID)

/* Crear producto */
router.post('/', [
    validarJWT,
    validarUser,
    validarRole('ADMIN_ROLE','SELLER_ROLE'),
    check('name').not().isEmpty(),
    check('categoria').not().isEmpty(),
    validarProduct,
    validarCategoriaForName,
    validarCampos
	], createProducto)

/* Actualizar producto */
router.put('/:id', [
    check('id').isMongoId(),
    check('name').not().isEmpty(),
    validarJWT,
    validarUser,
    validarRole('ADMIN_ROLE', 'SELLER_ROLE'),
    validarProductNotExist,
    validarCategoriaForName,
    validarCampos
], updateProducto)

router.delete('/:id',[
    check('id').isMongoId(),
    validarJWT,
    validarUser,
    validarRole('ADMIN_ROLE', 'SELLER_ROLE'),
    validarProductNotExist,
    validarCampos
], deleteProducto)


module.exports = router

