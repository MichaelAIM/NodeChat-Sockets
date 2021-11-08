const { response } = require("express");
const { Categoria } = require('../models');
const usuario = require("../models/usuario");

// obtener categorias paginado total populate
const getCategorias = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = { estado:true };

    const [ total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','nombre')
    ]);


    res.json({ total, categorias });
}

// obtener categorias  populate
const getCategoriasPorId = async(req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json({ categoria });
}

const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaBD = await Categoria.findOne({ nombre });

    if ( categoriaBD ) {
        return res.status(400).json({
            msg: `la Categoria ${nombre} ya existe`
        })
    }
    // Generar la data para guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = new Categoria( data );
    //Guardar BD
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizar categorias
const actualizarCategoria = async(req, res = response) => {
    const id = req.params.id;
    const {estado, usuario, ...resto} = req.body;
    console.log(resto.usuario);
    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;
    const updatedCategoria = await Categoria.findByIdAndUpdate(id, resto, {new: true});

    res.json( updatedCategoria );
}

// borrar categorias est:false
const BorrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    const  categoria= await Categoria.findByIdAndUpdate(id, {estado:false }, {new: true});

    res.status(200).json({
        categoria
    });
}


module.exports = {
    crearCategoria,
    getCategorias,
    getCategoriasPorId,
    actualizarCategoria,
    BorrarCategoria
}