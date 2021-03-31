const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuario = async(termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    //expresion regular para case insensitive
    const regexp = new RegExp(termino, 'i');
    //hago un or entre correo y nombre
    const usuarios = await Usuario.find({
        $or: [{ nombre: regexp }, { correo: regexp }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });
}


const buscarProductos = async(termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const producto = await (await Producto.findById(termino)).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    //expresion regular para case insensitive
    const regexp = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regexp, estado: true }).populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}


const buscarCategorias = async(termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);

    if (isMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    //expresion regular para case insensitive
    const regexp = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regexp, estado: true });

    res.json({
        results: categorias
    });
}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Busqueda no implementada'
            })
            break;
    }

}


module.exports = buscar;