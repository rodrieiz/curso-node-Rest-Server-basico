const { response, request } = require("express");

const { Categoria } = require('../models');


// obtener categorias - paginado - total -populate
const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    //el promise.all ejecuta ambas promesas a la vez y espera a que terminen las 2
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({
        total,
        categorias
    });
}

// obtener categoria por id - populate
const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);

}

// crear una nueva categoria
const crearCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Guardar DB
    await categoria.save();

    res.status(200).json(categoria)
}

// actualizar categoria
const actualizarCategoria = async(req = request, res = response) => {
    //ya vengo con un id validado
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({ categoria });

}

// borrar categoria - estado: false
const borrarCategoria = async(req = request, res = response) => {
    //ya vengo con un id validado
    const { id } = req.params;
    const categoridaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(categoridaBorrada)
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}