
const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')
const {validarUser, validarRole} = require('../middlewares/validar-user');

const { validateRole, validateExistMail, validateExistUserById } = require('../helpers/validar-user');

const { usuariosGet,
		usuariosPut,
		usuariosPost,
		usuariosDelete,
		usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id',[

    check('id', 'El id no es valido!').isMongoId(),
    check('id').custom(validateExistUserById),
    check('role').custom(validateRole),
    validarCampos

],usuariosPut );

router.post('/',[
	check('mail', 'El correo no es valido!').isEmail(),
	check('mail').custom(validateExistMail),
	check('name', 'Debe incluir un nombre!').not().isEmpty(),
	check('pass', 'Debe incluir una contraseña y ser mayor a 6 digitos!').not().isEmpty().isLength(        {min: 6}),
	check('role').custom(validateRole),
	/*check('role', 'Debe incluir un rol!').isIn(['ADMIN_ROLE', 'USER_ROLE']),*/
	validarCampos

], usuariosPost );

router.delete('/:id',[
    validarJWT, 
    validarUser,
    validarRole("ADMIN_ROLE"),
    check('id', 'El id no es valido!').isMongoId(),
    check('id').custom(validateExistUserById),
    validarCampos

], usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;