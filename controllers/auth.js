const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {
    try {
        const { email, password } = req.body;

        // Verificar que el email no exista
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }
        console.log('req.body', req.body);
        const usuario = new Usuario( req.body );

        // TODO: encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt );

        // guardar usuario en BD
        await usuario.save();

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

// login
const login = async(req,res) => {

    const { email, password } = req.body;

    try {
        // Verificar si existe el correo
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({ // en realidad no deberiamos de especificar QUE es lo que no se encontro, tendría que ser ambiguo o el mismo mensaje para todos, por un tema de seguridad
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // validar el password
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Password no es correcto'
            })
        }

        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        
    }
}

// renewToken
const renewToken = async(req, res) => {

    const uid = req.uid;

    // Generar un nuevo JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}