const { response } = require('express');

const getUsuarios = (req, res = response) => {
    //desestructuro los parametros
    const { q, nombre, edad } = req.query;
    res.json({
        msg: 'get APi - controlador',
        q,
        nombre,
        edad
    });
}

const postUsuario = (req, res = response) => {
    const { nombre, edad } = req.body;
    res.json({
        msg: 'post APi - controlador',
        nombre,
        edad
    });
}

const putUsuario = (req, res = response) => {

    const id = req.params.id;
    res.json({
        msg: 'put APi - controlador',
        id
    });
}

const deleteUsuario = (req, res) => {
    res.json({
        msg: 'delete APi - controlador'
    });
}


module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}