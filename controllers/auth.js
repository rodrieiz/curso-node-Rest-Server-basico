const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify")

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

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //tengo q crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido'
        })

    }
}

module.exports = {
    login,
    googleSignIn
}