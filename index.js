const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee_tracker',
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected');
})


