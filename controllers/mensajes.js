const Mensaje = require("../models/mensaje");

const obtenerChat = async(req, res) => {
    const miId = req.uid;
    const mensajesDe = req.params.de;

    const last30 = await Mensaje.find({
        // Esta es la "consulta" a la bd
        // es un OR, o sea va a validar la primer expresion y le mete el or y hace la otra, es decir esto o esto
        // busca los mensajes que el "de" sea igual a mi id y el "para" sea igual a mensajesDe
        $or: [
            {de: miId, para: mensajesDe},
            {de: mensajesDe, para: miId},
        ]
    })
    .sort({ createdAt: 'asc'})
    .limit(30);

    res.json({
        ok: true,
        miId,
        mensajes: last30
    })
}

module.exports = {
    obtenerChat
}