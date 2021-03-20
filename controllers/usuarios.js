const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const getUsuarios = async(req, res = response) => {
    //desestructuro los parametros
    //const { q, nombre, edad } = req.query;
    //si no viene es 5 por defecto
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    //el promise.all ejecuta ambas promesas a la vez y espera a que terminen las 2
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find({ estado: true })
        .limit(Number(limite))
        .skip(Number(desde))
    ])

    res.json({
        total,
        usuarios
    });
}

const postUsuario = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    //encriptar 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en db
    await usuario.save();

    res.json({
        usuario
    });
}

const putUsuario = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra BD

    if (password) {
        //encriptar 
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
}

const deleteUsuario = async(req, res) => {

    const { id } = req.params;

    //borrado fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({ usuario });
}


module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}