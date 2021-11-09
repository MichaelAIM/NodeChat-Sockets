const { response } = require("express");
const fs = require("fs");
const path = require('path');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
const subirArchivo = require("../helpers/subirArchivo");
const { Usuarios, Producto } = require("../models");

const cargarArchivo = async(req , res = response) => {
    try {
        const nombre = await subirArchivo( req.files, extenciones );
        res.json( nombre ); 
    } catch ( msg ) {
        res.status(400).json({ msg });
    }
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let models;

    switch (coleccion) {
        case 'users':
            models = await Usuarios.findById( id );
            if ( !models ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            models = await Producto.findById( id );
            if ( !models ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id: ${id}`
                });
            }
            break;
        default:
            res.status(500).json('se me olvido esta validacion')
            break;
    }
// limpiar imagenes
    if ( models.img ) {
        const nombreArr = models.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [ public_id ]  = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }
    // cargar a cloudinary
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    models.img = secure_url;

    await models.save();
    res.json({ models });
}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let models;

    switch (coleccion) {
        case 'users':
            models = await Usuarios.findById( id );
            if ( !models ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            models = await Producto.findById( id );
            if ( !models ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id: ${id}`
                });
            }
            break;
        default:
            res.status(500).json('se me olvido esta validacion')
            break;
    }

    if ( models.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, models.img );
        if (fs.existsSync( pathImagen )) {
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    models.img = nombre;

    await models.save();
    res.json({ models });
}

const mostrarImagen = async( req, res = response) => {
    const { id, coleccion } = req.params;
    let models;

    switch (coleccion) {
        case 'users':
            models = await Usuarios.findById( id );
            if ( !models ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            models = await Producto.findById( id );
            if ( !models ) {
                return res.status(400).json({
                    msg: `No existe el producto con el id: ${id}`
                });
            }
            break;
        default:
            res.status(500).json('se me olvido esta validacion')
            break;
    }

    if ( models.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, models.img );
        if (fs.existsSync( pathImagen )) {
            return res.sendFile( pathImagen );
        }
    }else{
        const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
        return res.sendFile( pathImagen );
    }

    // const nombre = await subirArchivo( req.files, undefined, coleccion );
    // models.img = nombre;

    // await models.save();
    res.json({ models });
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
};