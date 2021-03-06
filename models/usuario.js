const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    url: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin_role', 'user_role']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: { //creado con google
        type: Boolean,
        default: false
    }
});

// sobreescribo el metodo por defecto y remuevo la pass y la version para q al mandar el print no aparezcan
usuarioSchema.methods.toJSON = function() {
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}


module.exports = model('Usuario', usuarioSchema);