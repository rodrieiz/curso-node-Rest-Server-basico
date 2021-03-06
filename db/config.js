const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log("Base de datos conectada");

    } catch (error) {
        console.log(error);
        throw new Error("error al iniciar db");
    }

}

module.exports = {
    dbConnection
}