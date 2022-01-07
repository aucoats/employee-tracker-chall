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
    initPrompt();
})

// inquirer prompts
function initPrompt() {

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
                queryDatabase(answer.init);
                break;
            case promptChoices.viewRoles: 
                queryDatabase(answer.init);
                break;
            case promptChoices.viewEmployees:
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
        query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS 
        department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            LEFT JOIN employee manager on manager.id = employee.manager_id
            INNER JOIN roles ON (roles.id = employee.role_id)
            INNER JOIN department ON (department.id = roles.department_id)
            ORDER BY employee.id`;
    } else if (prompt === promptChoices.viewRoles) {
        query = `
        `
    }
    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`
            =========================================
                Results for ${prompt}:
            =========================================`);
        console.table(res);
        initPrompt();
    });

}

// displays all employees/departments/roles dependent on inquirer response


