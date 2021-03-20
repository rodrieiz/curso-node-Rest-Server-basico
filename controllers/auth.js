const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / password incorrectos - correo"
            })
        }
        //Verificar usuario activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / password incorrectos - estado: false"
            })
        }
        //Verificar contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                msg: "Usuario / password incorrectos - password"
            })
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: "Login ok",
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al iniciar sesión, contacte al admin"
        })
    }

}

module.exports = {
    login
}