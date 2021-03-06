const Role = require('../models/role');
const Usuario = require('../models/usuario');


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

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioId
}