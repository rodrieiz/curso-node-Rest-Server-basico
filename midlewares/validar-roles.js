const { response, request } = require("express");


const esAdminRole = (req = request, res = response, next) => {
    //como el validarJWT ya valida el token y carga el usuario

    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verficar el role sin validar el token primero"
        });
    }

    const { rol, nombre } = req.usuario;
    if (rol !== 'admin_role') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no se puede completar`
        });
    }

    next();
}

// ... operador resto de los argumentos
const tieneRol = (...roles) => {


    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere verficar el role sin validar el token primero"
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles} `
            });
        }


        next();
    }

}

module.exports = { esAdminRole, tieneRol };