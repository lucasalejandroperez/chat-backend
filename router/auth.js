/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear nuevos usuarios
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
] , crearUsuario);

/**
 nombre: string,, que no este vacio
 password: string, que no este vacio
 email: isEmail y obligaotiro
 */

// Login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
] , login);

// Revalidar token
// como es un solo paso no va entre corchetes el validarJWT, por ej si tuvieramos que hacer mas validaciones, ahi si iria entre corchetes
// Pero aca lo unico que queremos que cuando se llama a un renew, es que valide el JWT y listo, cumple esa funcion
router.get('/renew', validarJWT , renewToken);

module.exports = router;