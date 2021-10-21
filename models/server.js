const express = require('express')
const cors = require('cors')

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.user = '/api/user';

        //Middlewares
        this.middlewares();
        //RUTAS
        this.routes();
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
        this.app.use(this.user, require('../routes/users.routes'));
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto '+this.port);
        });

    }

}

module.exports = Server;