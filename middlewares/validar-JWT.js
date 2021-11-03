const { response, request } = require('express');
var jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response , next ) => {
    const token = req.header('x-token');
    // console.log(token);
    //Si no existe el token
    if (!token) {
        return res.status(401).json({
            msg:"No hay Token en la petición"
        });
    }

    try {
        //verificar Token valido
        const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        const datosUsuario = await Usuario.findById(uid);
        //Si el usuario no existe en la BD
        if (!datosUsuario) {
            return res.status(401).json({
                msg:"Token no valido - usuario no existe"
            });
        }
        //Si el usuario esta desactivado
        if (!datosUsuario.estado) {
            return res.status(401).json({
                msg:"Token no valido - usuario con estado: false"
            });
        }

        req.usuario = datosUsuario;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg:"Token no valido"
        });
    }

}
module.exports = {
    validarJWT
}