const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../db/config');
require('dotenv').config();



class Server {


    constructor() {
        //me creo la aplicacion de express como una propiedad de la clase server
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos'
        }


        //Conectar bd 
        this.conectarDB();

        //middlewares
        this.middlewares();

        //peticiones
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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
        //path - archivo de la ruta
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }

    //
    listen() {
        this.app.listen(this.port, () => {
            console.log("App en el puerto:", this.port);
        })
    }


}

module.exports = Server;