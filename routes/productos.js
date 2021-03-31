const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validator');
const { validarCampos } = require('../midlewares/validar-campos');
const validarJWT = require('../midlewares/validar-jwt');
const { esAdminRole } = require('../midlewares/validar-roles');

const router = Router();

/**
 *  {{url}}/api/productos
 */

// Obtener todos las productos - acceso publico
router.get('/', obtenerProductos);

// Obtener un producto por id - acceso publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear producto - acceso privado, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Actualizar - acceso privado, cualquier persona con un token token valido
router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar un producto - acceso usuarios admin role
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


module.exports = router;