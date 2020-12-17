const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const session = require('express-session');
const multer = require('multer');

dotenv.config({path: './.env'});

const app = express();


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    name: 'sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'hbs');

db.connect((error) => {
    if(error){
        console.log(error)
    }else{
        console.log("MySQL Connected")
    }
})

//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server started on 5000")
});