const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');
    console.log(token);

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        //la funcion lanza un error si el token no es valido
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //recuperar el usuario autenticado (uid)
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no valido - usuario no existe en DB"
            })
        }
        //validar no sea un usuario eliminado  
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Token no valido - usuario con estado: false"
            })
        }

        //agrego una propiedad
        req.usuario = usuario;

        next(); //para que continue al siguiente middleware
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

}

module.exports = validarJWT;