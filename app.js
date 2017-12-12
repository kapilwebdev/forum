const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');

// Database connection
mongoose.connect(config.database, {useMongoClient: true});
mongoose.connection.on('connected', () => {
    console.log('Connected to', mongoose.connection.db.s.databaseName, 'database');
});

const app = express();

// app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(cors());

// Routes

app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

const users_routes = require('./routes/users');
app.use('/user', users_routes);

// Listening port

const port = 4444;

app.listen(port, () => {
    console.log('Server is running at', port);
});