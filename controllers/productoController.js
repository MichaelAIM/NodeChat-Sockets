const { response } = require("express");
const { body } = require("express-validator");
const { Producto} = require('../models');

// obtener categorias paginado total populate
const getProductos = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = { estado:true };

    const [ total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','nombre')
            .populate('categoria','nombre')
    ]);
    res.json({ total, productos });
}

// obtener categorias  populate
const getProductosPorId = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
            .populate('categoria','nombre')
            .populate('usuario','nombre');

    res.json({ producto });
}

const crearProducto = async(req, res = response) => {
    const { estado, usuario, ...body} =  req.body;

    const productoBD = await Producto.findOne({ nombre:body.nombre, categoria:body.categoria});

    if ( productoBD ) {
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe en la Categoria`
        })
    }
    // Generar la data para guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto( data );
    //Guardar BD
    await producto.save();

    res.status(201).json(producto);
}

// actualizar categorias
const actualizarProducto = async(req, res = response) => {
    const id = req.params.id;
    const {estado, usuario, ...resto} = req.body;
    if (resto.nombre) {
        resto.nombre = resto.nombre.toUpperCase();   
    }
    resto.usuario = req.usuario._id;
    const updatedProducto = await Producto.findByIdAndUpdate(id, resto, {new: true});

    res.json( updatedProducto );
}

// borrar categorias est:false
const BorrarProducto = async(req, res = response) => {
    const { id } = req.params;

    const  producto= await Producto.findByIdAndUpdate(id, {estado:false }, {new: true});

    res.status(200).json({
        producto
    });
}


module.exports = {
    getProductos,
    getProductosPorId,
    crearProducto,
    actualizarProducto,
    BorrarProducto
}