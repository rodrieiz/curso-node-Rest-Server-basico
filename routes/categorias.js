const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validator');
const { validarCampos } = require('../midlewares/validar-campos');
const validarJWT = require('../midlewares/validar-jwt');
const { esAdminRole } = require('../midlewares/validar-roles');

const router = Router();

/**
 *  {{url}}/api/categorias
 */

//Obtener todas las categorias - acceso publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - acceso publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

//Crear categoria - acceso privado, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - acceso privado, cualquier persona con un token token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar una categoria - acceso usuarios admin role
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;