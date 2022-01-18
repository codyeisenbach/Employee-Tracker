DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE `employeeTracker_db`.`department`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR
(30) NULL,
  PRIMARY KEY
(`id`));



CREATE TABLE `employeeTracker_db`.`role`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR
(50) NULL,
  `salary` DECIMAL
(19, 4) NULL,
  `department_id` INT NULL,
  PRIMARY KEY
(`id`));

CREATE TABLE `employeeTracker_db`.`employees`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR
(30) NULL,
  `last_name` VARCHAR
(30) NULL,
  `role_id` INT NOT NULL,
  `manager_id` INT NULL,
  PRIMARY KEY
(`id`));



INSERT INTO department
  (name)
VALUES
  ("Sales"),
  ("Accounting"),
  ("Product Oversight"),
  ("Quality Assurance"),
  ("Customer Service"),
  ("Human Resources"),
  ("Reception"),
  ("Warehouse"),
  ("Management");


INSERT INTO role
  (title, salary, department_id)
VALUES
  ("Sales Person", 50000.00, 1),
  ("Accountant", 50000.00, 2),
  ("Supplier Relations Representative", 45000.00, 3),
  ("Quality Assurance Representative", 45000.00, 4),
  ("Customer Service Representative", 40000.00, 5),
  ("Human Resources Representative", 50000.00, 6),
  ("Receptionist", 40000.00, 7),
  ("Warehouse Foreman", 45000.00, 8),
  ("Warehouse Staff", 40000.00, 8),
  ("Management", 50000.00, 9);

