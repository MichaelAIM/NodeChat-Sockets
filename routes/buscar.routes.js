const {Router} = require('express');
const { buscar } = require('../controllers/buscarController');

const router = Router();

// obtener todas las Productos - publico
router.get('/:coleccion/:termino', buscar);


module.exports = router;