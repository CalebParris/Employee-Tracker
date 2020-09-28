USE employee_DB;

INSERT INTO departments (name) VALUES ("Human Resources"), ("Software Engineering"), ("Payroll");

INSERT INTO roles (title, salary, department_id) VALUES ("HR Manager", 60000, 1), ("HR Representative", 40000, 1), ("Sr. Engineer", 120000, 2), ("Jr. Engineer", 60000, 2), ("Payroll Manager", 50000, 3), ("Payroll Associate", 40000, 3);

INSERT INTO employees (first_name, last_name, role_id) VALUES ("John", "Smith", 1), ("Bob", "Johnson", 3), ("Jessica", "Wells", 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", 2, 1), ("Steve", "Jones", 4, 2), ("Zach", "Fatino", 6, 3);