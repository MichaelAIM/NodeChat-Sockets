const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuarios, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'user',
    'productos',
    'categorias',
    'roles',
];

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);
    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }
    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre:regex, estado:true});
    res.json({
        results: categorias 
    });
}

const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);
    if ( esMongoID ) {
        const usuario = await Usuarios.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }
    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuarios.find({
        $or: [{ nombre:regex },{correo:regex}],
        $and: [{estado:true}]
    });
    res.json({
        results: usuarios 
    })
}

const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);
    if ( esMongoID ) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }
    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre:regex, estado:true }).populate('categoria','nombre');
    res.json({
        results: productos 
    });
}

const buscar = (req, res = response) =>{
    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'user':
            buscarUsuarios( termino, res );
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;        
        case 'categorias':
            buscarCategorias( termino, res );
            break;
        default:
            res.status(500).json({
                msg:'error de validacion'
            })
            break;
    }
} 

module.exports = {
    buscar
}