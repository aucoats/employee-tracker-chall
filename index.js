const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
require('dotenv').config();

// creates connection to db w/dotenv credentials
const connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee_tracker',
});

// object to hold initial prompt choices
const promptChoices = {
    viewDepartments: 'View All Departments',
    viewRoles: 'View All Roles', 
    viewEmployees: 'View All Employees',
    addDepartment: 'Add A Department', 
    addRole: 'Add A Role', 
    addEmployee:'Add An Employee', 
    updateEmployee:'Update An Employee Role',
}

// connects to db & starts prompt on node index.js command
connection.connect(err => {
    if (err) throw err;
    console.log(`
            ============================   
            == Connection Successful! ==
            ============================
    `);
    prompt();
})

// inquirer prompts
function prompt() {

    console.log(`
        ====================================
        Welcome to your Employee Tracker DB!
        ====================================
        `)
    
    inquirer.prompt({
        name: 'init', 
        type: 'list', 
        message: 'How can we help you?', 
        choices: [
            promptChoices.viewDepartments,
            promptChoices.viewRoles,
            promptChoices.viewEmployees,
            promptChoices.addDepartment,
            promptChoices.addRole,
            promptChoices.addEmployee,
            promptChoices.updateEmployee
        ]
    })
    .then(answer => {
        console.log('answer:', answer);
        switch (answer.init) {
            case promptChoices.viewDepartments: 
                console.log('View All Departments');
                // viewDepartments();
                queryDatabase(answer.init);
                break;
            case promptChoices.viewRoles: 
                console.log('View All Roles');
                // viewRoles();
                queryDatabase(answer.init);
                break;
            case promptChoices.viewEmployees:
                console.log('View Employees');
                queryDatabase(answer.init);
                break;
            case promptChoices.addDepartment:
                console.log('Add a Department');
                // addDepartment();
                break;
            case promptChoices.addRole:
                console.log('Add A Role');
                // addRole();
                break;
            case promptChoices.addEmployee:
                console.log('Add Employee');
                // addEmployee();
                break;
            case promptChoices.updateEmployee:
                console.log('Update emp role');
                // updateEmployee();
                break;
        }
    });

  
}

// functions called on inquirer responses
function queryDatabase(prompt) {
    let query; 
    if (prompt === promptChoices.viewDepartments) {
        query = 'SELECT * FROM department;'
    } else if (prompt === promptChoices.viewEmployees) {
        query = 'SELECT * FROM employee;'
    } else if (prompt === promptChoices.viewRoles) {
        query = 'SELECT * FROM roles;'
    }
    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`
        =========================================
                Results for ${prompt}:
         =========================================`);
        console.table(res);
    });
}

// displays all employees/departments/roles dependent on inquirer response


