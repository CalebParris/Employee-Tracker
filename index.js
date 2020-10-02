const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View Employees', 'View Employees By Department', 'View Employees by Role', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Exit']
        }
    ]).then(function(answer){
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

            case 'Exit':
                connection.end();
        }
    });
}

function allEmployees(){
    let query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee, title, name AS department, salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM departments, roles, employees AS e LEFT JOIN employees AS e2 ON e2.id = e.manager_id WHERE e.role_id = roles.id AND roles.department_id = departments.id";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        employeeTracker();
    });
}

function departmentEmployees(){
    let query = "SELECT * FROM departments";
    connection.query(query, function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'departments',
                message: 'Which department would you like to view?',
                choices: function(){
                    let deptName = [];
                    for (let i = 0; i < res.length; i++){
                        deptName.push(res[i].name);
                    }
                    return deptName;
                }
            }
        ]).then(function(answer){
            let query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee, title, name AS department, salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM departments, roles, employees AS e LEFT JOIN employees AS e2 ON e2.id = e.manager_id WHERE e.role_id = roles.id AND roles.department_id = departments.id AND departments.name = ?";
            connection.query(query, [answer.departments], function(err, res){
                if (err) throw err;
                console.table(res);
                employeeTracker();
            });
        });
    });
}

function roleEmployees(){
    let query = "SELECT * FROM roles";
    connection.query(query, function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'roles',
                message: 'Which role would you like to view?',
                choices: function(){
                    let roleName = [];
                    for (let i = 0; i < res.length; i++){
                        roleName.push(res[i].title);
                    }
                    return roleName;
                }
            }
        ]).then(function(answer){
            let query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee, title, name AS department, salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM departments, roles, employees AS e LEFT JOIN employees AS e2 ON e2.id = e.manager_id WHERE e.role_id = roles.id AND roles.department_id = departments.id AND roles.title = ?";
            connection.query(query, [answer.roles], function(err, res){
                if (err) throw err;
                console.table(res);
                employeeTracker();
            });
        });
    });
}

function addEmployee(){
    let query = "SELECT * FROM roles";
    connection.query(query, function(err, res){
        if (err) throw err;
        let newEmployeeRole = [];
        for (let i = 0; i < res.length; i++){
            newEmployeeRole.push(res[i].title);
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'newEmpRole',
                message: 'Which role would you like the new employee to have?',
                choices: newEmployeeRole
            },
            {
                type: 'input',
                name: 'empFirstName',
                message: "Please enter the emplpyee's first name:"
            },
            {
                type: 'input',
                name: 'empLastName',
                message: "Please enter the emplpyee's last name:"
            }
        ]).then(function(answers){
            let firstName = answers.empFirstName;
            let lastName = answers.empLastName;
            let roleID;
            for (let i = 0; i < res.length; i++){
                if (answers.newEmpRole === res[i].title){
                    roleID = res[i].id;
                }
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'isManager',
                    message: 'Is this employee a manager?',
                    choices: ['Yes', 'No']
                }
            ]).then(function(answer){
                if (answer.isManager === 'Yes'){
                    let query = "INSERT INTO employees SET ?"
                    connection.query(query, 
                        {
                            first_name: firstName,
                            last_name: lastName,
                            role_id: roleID
                        },
                        function(error){
                            if (error) throw error;
                            console.log('New manager added');
                            employeeTracker()
                        });
                } else {
                    let query = "SELECT * FROM employees";
                    connection.query(query, function(errors, result){
                        if (errors) throw errors;
                        let managerList = [];
                        for (let i = 0; i < result.length; i++){
                            if (result[i].manager_id === null){
                                managerList.push(`${result[i].first_name} ${result[i].last_name}`)
                            }
                        }
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'managerChoices',
                                message: 'Please select a manager for the new employee:',
                                choices: managerList
                            }
                        ]).then(function(answer){
                            let query = "INSERT INTO employees SET ?"
                            let managerID;
                            for (let i = 0; i < result.length; i++){
                                if (answer.managerChoices === `${result[i].first_name} ${result[i].last_name}`){
                                    managerID = result[i].id;
                                }
                            }
                            connection.query(query,
                                {
                                    first_name: firstName,
                                    last_name: lastName,
                                    role_id: roleID,
                                    manager_id: managerID
                                },
                                function(errors){
                                    if (errors) throw errors;
                                    console.log('Added new employee');
                                    employeeTracker();
                                });
                        });
                    });
                }
            });
        });
});
}

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'Please enter the name of the new department:'
        }
    ]).then(function(answer){
        let query = "INSERT INTO departments SET ?"
        connection.query(query, { name: answer.newDept }, function(err){
            if (err) throw err;
            console.log('New Department Added');
            employeeTracker();
        });
    });
}

function addRole(){
    let query = "SELECT * FROM departments";
    connection.query(query, function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'newRoleDept',
                message: 'Which department would you like the new role to be in?',
                choices: function(){
                    let newRoleDept = [];
                    for (let i = 0; i < res.length; i++){
                        newRoleDept.push(res[i].name);
                    }
                    return newRoleDept;
                }
            },
            {
                type: 'input',
                name: 'newRoleTitle',
                message: 'Please enter the title of this new role:'
            },
            {
                type: 'number',
                name: 'newRoleSalary',
                message: 'Please enter the salary for this new role:'
            }
        ]).then(function(answers){
            let query = "INSERT INTO roles SET ?";
            let deptID;
            for (let i = 0; i < res.length; i++){
                if (answers.newRoleDept === res[i].name){
                    deptID = res[i].id;
                }
            }
            connection.query(query,
                 {
                     title: answers.newRoleTitle,
                     salary: answers.newRoleSalary,
                     department_id: deptID
                 },
                  function(err){
                if (err) throw err;
                console.log('New Role Added');
                employeeTracker();
            });
        });
});
}

function updateRole(){
    let query = "SELECT * FROM employees";
    connection.query(query, function(err, res){
        if (err) throw err;
        let updateEmp = [];
        for (let i = 0; i < res.length; i++){
            updateEmp.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'empList',
                message: 'Select the employee that you wish to have the role updated:',
                choices: updateEmp
            }
        ]).then(function(answer){
            let query = "SELECT * FROM roles"
            let empToBeUpdated;
            for (let i = 0; i < res.length; i++){
                if (answer.empList === `${res[i].first_name} ${res[i].last_name}`){
                    empToBeUpdated = res[i].id;
                }
            }
            connection.query(query, function(error, result){
                if (error) throw error;
                let updateRole = [];
                for (let i = 0; i < result.length; i++){
                    updateRole.push(result[i].title);
                }
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleList',
                        message: 'Please select the new role you would like the employee to have:0',
                        choices: updateRole
                    }
                ]).then(function(answer){
                    let query = "UPDATE employees SET ? WHERE ?"
                    let newRoleID;
                    for (let i = 0; i < result.length; i++){
                        if (answer.roleList === result[i].title){
                            newRoleID = result[i].id;
                        }
                    }
                    connection.query(query,
                        [
                            {
                                role_id: newRoleID
                            },
                            {
                                id: empToBeUpdated
                            }
                        ],
                        function(errors){
                            if (errors) throw errors;
                            console.log('Employee role updated');
                            employeeTracker();
                        });
                });
            });

        });
    });
}