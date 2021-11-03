const { response } = require("express");


const esAdminRole = ( req, res = response , next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg:"debe validar el token antes de verificar el rol"
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:`${nombre} no es administrador`
        });
    }

    next();
}


const tieneRol = ( ...roles ) =>{

    return ( req, res = response , next ) => {
        // console.log(roles);

        if ( !req.usuario ) {
            return res.status(500).json({
                msg:"debe validar el token antes de verificar el rol"
            });
        }

        if ( !roles.includes(req.usuario.rol) ) {
            return res.status(401).json({
                msg:`El servicio necesita los siguientes roles ${roles}`
            });
        }

        next();
    } 
}

module.exports = {
    esAdminRole,
    tieneRol
}