require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
    // database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true, useFindAndModify: true
    });

    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database connected.');
    }).catch(err => {
        console.log('Connection Error.');
    });
}

module.exports = connectDB;