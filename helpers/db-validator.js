const { Categoria, Usuario, Role, Producto } = require('../models');


const esRolValido = async(rol = '') => {
    const existeRole = await Role.findOne({ rol: rol });
    console.log(existeRole);
    if (!existeRole) {
        throw new Error(`El rol ${rol} no está registrado en la bd`);
    }
}

const emailExiste = async(correo = '') => {
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) {
        throw new Error(`El correo ya está registrado en la bd`);

    }
}

const existeUsuarioId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no está registrado en la bd`);
    }
}

/** 
 * Validadores personalizados de categorias 
 */
const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id ${id} no está registrado en la bd`);
    }
}


/** 
 * Validadores personalizados de productos 
 */
const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id ${id} no está registrado en la bd`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioId,
    existeCategoriaPorId,
    existeProductoPorId
}