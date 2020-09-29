const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_DB"
});

connection.connect(function(err){
    if (err) throw err;
    employeeTracker();
});

function employeeTracker(){
    inquirer.prompt(
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View Employees', 'View Employees By Department', 'View Employees by Role', 'View Employees By Manager', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Update Employee Manager', 'Remove Department', 'Remove Role', 'Remove Employee', 'View Utilized Department Budget', 'Exit']
        }
    ).then(function(answer){
        switch(answer.option){
            case 'View Employees':
                allEmployees();
                break;

            case 'View Employees By Department':
                departmentEmployees();
                break;

            case 'View Employees by Role':
                roleEmployees();
                break;

            case 'View Employees By Manager':
                managerEmployees();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Update Employee Role':
                updateRole();
                break;

            case 'Update Employee Manager':
                updateManager();
                break;

            case 'Remove Department':
                deleteDepartment();
                break;

            case 'Remove Role':
                deleteRole();
                break;

            case 'Remove Employee':
                deleteEmployee();
                break;

            case 'View Utilized Department Budget':
                departmentBudget();
                break;

            case 'Exit':
                connection.end();
        }
    });
}

function allEmployees(){}

function departmentEmployees(){}

function roleEmployees(){}

function managerEmployees(){}

function addEmployee(){}

function addDepartment(){}

function addRole(){}

function updateRole(){}

function updateManager(){}

function deleteDepartment(){}

function deleteRole(){}

function deleteEmployee(){}

function departmentBudget(){}