const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { createServer } = require('http');
const { socketController } = require('../sockets/socketsController');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require('socket.io')( this.server );
        this.paths = {
            auth : '/api/auth',
            categorias : '/api/categorias',
            buscar : '/api/buscar',
            productos : '/api/productos',
            user : '/api/user',
            uploads : '/api/uploads',
        }

        //BD
        this.conectarBD();
        //Middlewares
        this.middlewares();
        //RUTAS
        this.routes();
        //Sockets
        this.sockets();
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

        //Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
        this.app.use(this.paths.user, require('../routes/users.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    }

    sockets(){
        this.io.on("connection", ( sock ) => socketController( sock, this.io ) );
    }

    listen(){
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto '+this.port);
        });

    }

}

module.exports = Server;