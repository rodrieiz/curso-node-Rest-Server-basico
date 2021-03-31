const { response, request } = require("express");

const { Producto } = require('../models');


// obtener productos - paginado - total -populate
const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    //el promise.all ejecuta ambas promesas a la vez y espera a que terminen las 2
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({
        total,
        productos
    });
}

// obtener producto por id - populate
const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);

}

// crear nuevo producto
const crearProducto = async(req = request, res = response) => {

    //saco el usuario y el estado para que no lo puedan cambiar
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);
    //Guardar DB
    await producto.save();

    res.status(200).json(producto)
}

// actualizar producto
const actualizarProducto = async(req = request, res = response) => {
    //ya vengo con un id validado
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({ producto });

}

// borrar producto - estado: false
const borrarProducto = async(req = request, res = response) => {
    //ya vengo con un id validado
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(productoBorrado)
}

module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProducto
}