var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "4654",
  database: "employeeTracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runTracker();
});

function runTracker() {
  inquirer
    .prompt({
      name: "first_prompt",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View All Employees":
        allEmployees();
        break;

      case "View All Employees By Department":
        empDepartment();
        break;

      case "View All Employees by Manager":
        empManager();
        break;

      case "Add Employee":
        addEmployee();
        break;
      
      case "Remove Employee":
        removeEmployee();
        break;

      case "Update Employee Role":
        updateEmpRole();
        break;

      case "Update Employee Manager":
        updateEmpManager();
        break;

      case "View All Roles":
        ViewAllRoles();
        break;
        
      case "exit":
        connection.end();
        break;
      }
    });
}

function allEmployees() {
  console.log("Selecting all employees...\n");
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}

function addEmployee() {
  inquirer
  .prompt([
    {
      name: 'firstname',
      message: 'Enter Employee First Name',
    },
    {
      name: 'lastname',
      message: 'Enter Employee Last Name',
    }
  ])
  .then(function(answer) {
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          first_name: answer.firstname
        },
        {
          last_name: answer.lastname
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
      })
      runTracker();
  })
};