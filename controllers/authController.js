const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-JWT");


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({correo});
        //Si el Usuario Existe
        if (!usuario) {
            return res.status(400).json({
                msg:"El correo no es valido"
            });
        }
        // Si en usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg:"El Usuario se encuentra desactivado"
            });
        }
        //Si la contraseña es Valida

        const validatePassword = bcryptjs.compareSync( password, usuario.password );

        if (!validatePassword) {
            return res.status(400).json({
                msg:"La Contraseña no es valida"
            });
        }

        //Generar el Token JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg:"Login OK",
            usuario, token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "comuniquese con el administrador"
        });
    }

}

module.exports = {
    login
}