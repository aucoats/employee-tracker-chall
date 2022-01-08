const mysql = require('mysql2');
const inquirer = require('inquirer');
const { parse } = require('dotenv');
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
        // calls function based on prompt response
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
                addDepartment();
                break;
            case promptChoices.addRole:
                addRole();
                break;
            case promptChoices.addEmployee: 
                addEmployee();
                break;
            case promptChoices.updateEmployee:
                console.log('Update emp role');
                // updateEmployee();
                break;
        }
    });
}

// displays all employees/departments/roles dependent on inquirer response
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
            ORDER BY employee.id;`
    } else if (prompt === promptChoices.viewRoles) {
        query = `SELECT roles.title, roles.id, department.name AS department, roles.salary
            FROM roles
            LEFT JOIN department on roles.department_id = department.id
            ORDER BY roles.id;
        `;
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

// adds department to db
function addDepartment() {
    inquirer.prompt([
        {
            name: 'name', 
            type: 'input', 
            message: "What is the new department's name?"
        }
    ]).then(newDept => {
        // takes prompt response and inserts into db
        connection.query(`INSERT INTO department SET ?`,
        {
            name: newDept.name 
        }, (err, res) => {
        if (err) throw err;

        console.log(`
        =====================================
        New Department ${newDept.name} added!
        =====================================
        `)
        initPrompt();
        }
    )})
}

// adds role to db
async function addRole() {
    // holds prompt input for new role name
    const newName = await inquirer.prompt([
        {
            name: 'name', 
            type: 'input', 
            message: "What is the new role's name?"
        }
    ])

    // holds prompt input for new role salary
    const newSalary = await inquirer.prompt([
        {
            name: 'salary', 
            type: 'input', 
            message: "What is the new role's salary?",
            // validate: () => {
            //     isInt(newSalary.newSalary == 1.00)
            // }
        }
    ])

    // queries dept db so user can choose which dept new role belongs to
    connection.query('SELECT department.id, department.name FROM department ORDER BY department.id', async (err, res) => {
        if (err) throw err; 

        const newDept = await inquirer.prompt(
            {
                name: 'name', 
                type: 'list', 
                choices: () => res.map(res => res.name), 
                message: "Which department does this new role belong to?"
            }
        )
        
        // declaration for later use
        let newDeptId; 

        // when row name matches user input, sets new role id
        for (const row of res) {
            if (row.name === newDept.name) {
                newDeptId = row.id;
                continue;
            }
        }

        // holds values for sql query
        let params = {
            title: newName.name,
            salary: newSalary.salary,
            department_id: newDeptId
        }

        // inserts info into roles table
        connection.query(
            `INSERT INTO roles SET?`, 
            {
               title: params.title, 
               salary: params.salary,
               department_id: params.department_id
            }, (err, res) => {
                if (err) throw err;
                console.log(` 
                ===================================================
                        New Role ${params.title} added!
                ===================================================`)
                initPrompt();
            })


    })
}

// adds employee to db
async function addEmployee() {
    
    // sets newName to user responses
    const newName = await inquirer.prompt([
        {
            name: 'firstName', 
            type: 'input', 
            message: "What is the new employee's first name?", 
        }, 
        {
            name: 'lastName', 
            type: 'input', 
            message: "What is the new employee's last name?"
        }])
   
    // queries roles db and uses res object to get choices for prompt
    connection.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err; 

        // newRole to hold prompt response
        const newRole = await inquirer.prompt(
            {
                name: 'role', 
                type: 'list', 
                choices: () => res.map(res => res.title), 
                message: "What is the new employee's role?", 
            }
        );

    // declares variable to hold new employee's role id
    let newRoleId; 
    
    // checks each row until matches with user input, sets newRoleId when matched & continues
    for (const row of res) {
        if (row.title === newRole.role) {
            newRoleId = row.id; 
            continue;
        }
    }
    
    // query employee db for manager choice
    connection.query('SELECT * FROM employee', async (err, res) => {
        if (err) throw err; 

        // concats first & last names of employees for prompt choices
        let managerChoice = res.map(res => `${res.first_name} ${res.last_name}`);

        // adds no manager option to prompt choices
        managerChoice.push('No manager');

        // newManager to hold prompt response
        let newManager = await inquirer.prompt([
            {
                name: 'newManager', 
                type: 'list', 
                choices: managerChoice, 
                message: "Who is the new employee's manager?"
            }
        ])

        // declare to set later
        let newManagerId; 

        // adds null response if new employee has no manager
        if (newManager.newManager === 'No manager') {
            newManagerId = null;
        } else {

            // matches response object with inquirer prompt, sets newManagerId for new employee & continues
            for (const row of res) {
                row.Name = `${row.first_name} ${row.last_name}`
                if (row.Name === newManager.newManager) {
                    newManagerId = row.id; 
                    continue;
                }
            }
        }

    // obj to hold query params
    let params = {
        first_name: newName.firstName, 
        last_name: newName.lastName, 
        role_id: newRoleId,
        manager_id: newManagerId
    }

    // inserts all required info into employee table
    connection.query(
        `INSERT INTO employee SET?`, 
        {
            first_name: params.first_name,
            last_name: params.last_name, 
            role_id: params.role_id,
            manager_id: params.manager_id
        }, (err, res) => {
            if (err) throw err;
            console.log(` 
            ===================================================
                New Employee ${params.first_name} added!
            ===================================================`)
            initPrompt();
        }
    )
    })
    })
};


