const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Database connection:
const connectDB = require('./config/db');
connectDB(); //running the connectDB function here.

// cors handling:
// const corsOptions = {
//     origin: process.env.ALLOWED_CLIENTS.split(',')
// }
// app.use(cors(corsOptions));
app.use(cors());

// Setup Template engine:
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// serving css/script files to ejs:
app.use(express.static('public'));
// server to know that we are sending the json data:
app.use(express.json());

// Setting Routes:
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening is on port ${PORT}`);
});