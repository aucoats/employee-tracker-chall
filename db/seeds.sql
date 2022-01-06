INSERT INTO department (name)
VALUES 
    ('Retail'),
    ('Engineering'),
    ('Human Resources'), 
    ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales', 50000.00, 1),
    ('Sales Lead', 60000.00, 1), 
    ('Engineer', 80000.00, 2),
    ('Senior Dev', 100000.00, 2), 
    ('HR Team', 60000.00, 3), 
    ('HR Manager', 80000.00, 3), 
    ('Consultant', 70000.00, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  
    (1, 'Yake', 'SLead', 2, NULL), 
    (2, 'Jake', 'Sales', 1, 1), 
    (3, 'Mas', 'ELead', 4, NULL), 
    (4, 'Sam', 'Engi', 3, 3), 
    (5, 'Omega', 'HRMan', 6, NULL), 
    (6, 'Kareen', 'HR', 5, 5), 
    (7, 'Josh', 'Cons', 7, NULL);
