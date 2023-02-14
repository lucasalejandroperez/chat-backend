const jwt = require('jsonwebtoken');

// Todos los middlewares tienen req, res, next
const validarJWT = ( req, res, next ) => {
    try {
        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }

        // Se agrega en el request el uid, esto es para que pueda ser usado mas adelante, porque vamos a necesitar ese uid
        // Es decir, una vez que salga del middleware, en la request va a estar puesto el uid (en el controller va a estar el uid en el request)
        const payload = jwt.verify( token, process.env.JWT_KEY );
        req.uid = payload.uid;

        next(); // con esto le indica que siga con el proximo middleware
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        })
    }
}

module.exports = {
    validarJWT
}