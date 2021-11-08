const {Router, json} = require('express');
const {check} = require('express-validator');
const { 
    crearCategoria, 
    getCategorias, 
    getCategoriasPorId, 
    BorrarCategoria, 
    actualizarCategoria 
} = require('../controllers/categoriasController');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// obtener todas las categorias - publico
router.get('/', getCategorias);
// obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], getCategoriasPorId);
// Crear categoria - privado solo con token valido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);
// actualizar registro por id - privado solo con token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);
// borrar categoria - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], BorrarCategoria);

module.exports = router;