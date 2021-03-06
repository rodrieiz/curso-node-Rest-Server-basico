const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioId } = require('../helpers/db-validator');
const { validarCampos } = require('../midlewares/validar-campos');


const router = Router();


router.get('/', getUsuarios);

// ruta - middlewares - controlador
router.post('/', [
    check('nombre', "El nombre es obligatorio").not().isEmpty(),
    check('password', "El pass debe tener al menos 6 letras").isLength({ min: 6 }),
    check('correo', "El correo no es válido").isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', "No es un rol permitido").isIn(['admin_role', 'user_role']),
    check('rol').custom(esRolValido),
    validarCampos
], postUsuario);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRolValido),
    validarCampos
], putUsuario);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], deleteUsuario);


module.exports = router;