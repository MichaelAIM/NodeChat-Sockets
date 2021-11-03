const {response, request} = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');


const userGet = async(req = request, res = response) => {
    // const {q, nombre = "No Name", id, page = "1", limit} = req.query;
    const {limite = 5, desde = 0} = req.query;
    const query = { estado:true };
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({ total, usuarios });
};

const userPost = async(req, res) => {
    // const {nombre,edad} = req.body;

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    await usuario.save();
    res.json({
        msg: 'POST api - Controller',
        usuario
        // nombre,
        // edad
    });
};

const userPut = async(req, res = response) => {
    const id = req.params.id;
    const { _id, correo, password, google, ...resto} = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const updatedUser = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json( updatedUser );
};

const userDelete = async(req, res) => {
    
    const id = req.params.id;
    const usuarioAutenticado = req.usuario;
    //Eliminar Fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false }, {new: true});


    res.json({
        usuario,
        usuarioAutenticado
    });
};

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}