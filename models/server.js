const express = require('express');
var cors = require('cors');
require('dotenv').config();


class Server {


    constructor() {
        //me creo la aplicacion de express como una propiedad de la clase server
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //middlewares
        this.middlewares();

        //peticiones
        this.routes();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));
    }

    // maneja las peticiones
    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    //
    listen() {
        this.app.listen(this.port, () => {
            console.log("App en el puerto:", this.port);
        })
    }


}

module.exports = Server;