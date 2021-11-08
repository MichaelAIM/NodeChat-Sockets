const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth : '/api/auth',
            categorias : '/api/categorias',
            buscar : '/api/buscar',
            productos : '/api/productos',
            user : '/api/user',
        }


        //BD
        this.conectarBD();
        //Middlewares
        this.middlewares();
        //RUTAS
        this.routes();
    }

    async conectarBD(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );

        //Lectura y parseo de Body
        this.app.use( express.json() );

        //Directorio Publico
        this.app.use( express.static('public') );
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
        this.app.use(this.paths.user, require('../routes/users.routes'));
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto '+this.port);
        });

    }

}

module.exports = Server;