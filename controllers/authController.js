const { response, json } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-JWT");
const { googleVerify } = require("../helpers/google-verify");


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

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            const data = {
                nombre,
                correo,
                password:':P',
                img,
                google:true
            }
            usuario = new Usuario( data );
            await usuario.save();
        }

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg:"Usuario Bloqueado"
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            msg:"Todo bien!",
            usuario,
            id_token
        });
    } catch (error) {
        json.status(400).json({
            msg:"El Token no se puedo verificar"
        });
    }

}

module.exports = {
    login,
    googleSignIn
}