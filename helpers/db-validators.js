const Role = require('../models/role');
const Usuario = require('../models/usuario');



const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no se encuentra registrado en la BD`);
    }
}

const EmailExiste = async ( correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya esta registrado`);
    }
}

const ExisteUsuario_ID = async ( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id: ${ id }, No esta registrado en la DB`);
    }
}


module.exports = {
    esRolValido,
    EmailExiste,
    ExisteUsuario_ID
}