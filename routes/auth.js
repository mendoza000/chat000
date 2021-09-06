const { Router } = require('express');
const { check } = require('express-validator');

const {authLogin, googleSingin, getAuthUser} = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();


router.post('/login',[
    
    check('mail', 'El correo es obligatorio!').isEmail(),
    check('pass', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos

] ,authLogin );

router.post('/google',[
    
    check('id_token', 'El id_token es obligatorio').not().isEmpty(),
    validarCampos

] ,googleSingin );

router.get('/',[
    check('x-token', 'El token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos
], getAuthUser)

module.exports = router