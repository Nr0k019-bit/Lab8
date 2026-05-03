const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');

const homeRoutes = require('./routes/index.routes');
const productRoutes = require('./routes/product.route');

// Connect to Database
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sock'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

global.db = db;

// Configure middleware
app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// Routes
app.use('/', homeRoutes);
app.use('/product', productRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
