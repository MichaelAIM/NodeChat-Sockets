const {Router, json} = require('express');
const {check} = require('express-validator');
const { 
    crearProducto, 
    getProductos, 
    getProductosPorId, 
    actualizarProducto, 
    BorrarProducto 
} = require('../controllers/productoController');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// obtener todas las Productos - publico
router.get('/', getProductos);
// obtener Productos por id - publico
router.get('/:id', [
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], getProductosPorId);
// Crear Productos - privado solo con token valido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es MongoId').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);
// actualizar Productos por id - privado solo con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);
// borrar Productos - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], BorrarProducto);

module.exports = router;