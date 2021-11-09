const { Router } = require('express');
const {check} = require('express-validator');

const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploadsController');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);
router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users','productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'No es un ID de MongoBD valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users','productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;