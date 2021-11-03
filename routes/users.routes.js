const {Router} = require('express');
const {check} = require('express-validator');

const validarCampos = require('../middlewares/validar-campos');
const { 
    esRolValido,
    EmailExiste,
    ExisteUsuario_ID
} = require('../helpers/db-validators');

const { 
    userGet, 
    userPost, 
    userPut, 
    userDelete } = require('../controllers/userController');

const router = Router();

router.get('/', userGet );

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es valido').isEmail(), 
    check('correo').custom( EmailExiste ), 
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
], userPost );

router.put('/:id', [
    check('id', 'No es un ID valido para mongoBD').isMongoId(),
    check('id').custom(ExisteUsuario_ID),
    check('rol').custom( esRolValido ),
    validarCampos
], userPut );

router.delete('/:id', [
    check('id', 'No es un ID valido para mongoBD').isMongoId(),
    check('id').custom(ExisteUsuario_ID),
    validarCampos
], userDelete );



module.exports = router;
