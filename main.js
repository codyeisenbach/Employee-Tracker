var mysql = require("mysql2");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runTracker();
});

//

// Main Prompt //

function runTracker() {
  inquirer
    .prompt({
      name: "first_prompt",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Manager",
        "View All Managers",
        "Add Employee",
        "Remove Employee",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View Employees by Role",
        "Update Employee Role",
        "Update Employee Manager",
        "Find the Budget of a Department",
        "exit",
      ],
    })
    .then(function (answer) {
      switch (answer.first_prompt) {
        case "View All Employees":
          allEmployees();
          break;

        case "View All Employees by Manager":
          viewByMngr();
          break;

        case "View All Managers":
          viewAllMngr();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "View All Departments":
          allDepartments();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Department":
          removeDepartment();
          break;

        case "View Employees by Department":
          empDepartment();
          break;

        case "View All Roles":
          allRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "View Employees by Role":
          empRole();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateEmpMngr();
          s;
          break;

        case "Find the Budget of a Department":
          deptBudget();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// View Employee By Role //

function empRole() {
  // query the database for all items being auctioned
  connection.query("SELECT title, id FROM role", function (err, res) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "role_prompt",
          type: "rawlist",
          message: "Select a Role",
          choices: roleChoicesArray(res),
        },
      ])
      .then(function (answer) {
        var answerId = [answer.role_prompt];
        var result = answerId[0]
          .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
          .map(Number);

        console.log(result);

        var query =
          "SELECT first_name, last_name, role_id FROM employees WHERE ?";
        connection.query(query, { role_id: result }, function (err, res) {
          if (err) throw err;
          res.forEach((res) =>
            console.log(
              res.first_name,
              res.last_name + "   Role ID: " + res.role_id
            )
          );
          runTracker();
        });
      });
  });
}

// View All Managers View Employees by Manager Update Employees by Manager //

function viewAllMngr() {
  connection.query(
    "SELECT first_name, last_name, role_id FROM employees WHERE employees.role_id = 9",
    function (err, res) {
      if (err) throw err;
      var result = [];
      for (var i = 0; i < res.length; i++) {
        result.push(`${res[i].first_name} ${res[i].last_name}`);
      }
      console.log(result.join("\n"));
      runTracker();
      return result;
    }
  );
}

function viewByMngr() {
  // query the database for all items being auctioned
  connection.query(
    "SELECT first_name, last_name, id FROM employees WHERE employees.role_id = 9",
    function (err, res) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "mngr_prompt",
            type: "rawlist",
            message: "Choose a Manager",
            choices: mngrChoicesArray(res),
          },
        ])
        .then(function (answer) {
          var answerId = [answer.mngr_prompt];
          const result = answerId[0]
            .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
            .map(Number);

          var query =
            "SELECT first_name, last_name, manager_id FROM employees WHERE ?";
          connection.query(query, { manager_id: result }, function (err, res) {
            if (err) throw err;
            res.forEach((res) =>
              console.log(
                res.first_name,
                res.last_name + "   Manager ID: " + res.manager_id
              )
            );
            runTracker();
          });
        });
    }
  );
}

function updateEmpMngr() {
  connection.query(
    "SELECT first_name, last_name, id FROM employees",
    function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "emp_prompt",
            type: "rawlist",
            message: "Select an employee",
            choices: empChoicesArray(res),
          },
        ])
        .then(function (answer) {
          console.log(answer.emp_prompt);
          var answerId = [answer.emp_prompt];
          var empResult = answerId[0]
            .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
            .map(Number);

          console.log(empResult);

          connection.query(
            "SELECT first_name, last_name, id FROM employees WHERE employees.role_id = 9",
            function (err, res) {
              if (err) throw err;
              inquirer
                .prompt([
                  {
                    name: "umngr_prompt",
                    type: "rawlist",
                    message: "Choose a Manager",
                    choices: mngrChoicesArray(res),
                  },
                ])
                .then(function (answer) {
                  console.log(answer.umngr_prompt);
                  var answerId = [answer.umngr_prompt];
                  var umngrResult = answerId[0]
                    .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
                    .map(Number);

                  console.log(umngrResult);

                  connection.query(
                    "UPDATE employees SET ? WHERE ?",
                    [
                      {
                        manager_id: umngrResult,
                      },
                      {
                        id: empResult,
                      },
                    ],
                    function (error) {
                      if (error) throw err;
                      console.log("Manager updated!");
                    }
                  );
                  runTracker();
                });
            }
          );
        });
    }
  );
}

// Employee Add Remove View //

function addEmployee() {
  connection.query("SELECT title, id FROM role", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter employee first name: ",
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter employee last name: ",
        },
        {
          name: "role",
          type: "rawlist",
          message: "Choose Employee Role: ",
          choices: roleChoicesArray(res),
        },
      ])
      .then(function (answer) {
        console.log(answer.role);
        var answerId = [answer.role];
        const result = answerId[0]
          .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
          .map(Number);

        console.log(result);

        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: result,
            manager_id: "1",
          },
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
          }
        );
        runTracker();
      });
  });
}

function removeEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee first name: ",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter employee last name: ",
      },
    ])
    .then(function (answer) {
      console.log(answer.firstName, answer.lastName);

      connection.query(
        "DELETE FROM employees WHERE ?",
        [
          {
            first_name: answer.firstName,
          },
          {
            last_name: answer.lastName,
          },
        ],
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
        }
      );
      runTracker();
    });
}

function allEmployees() {
  console.log("Selecting all employees...\n");
  connection.query(
    "SELECT first_name,last_name FROM employees",
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      for (var i = 0; i < res.length; i++) {
        let result = Object.values(res[i]);
        console.log(result.join(" "));
      }
      runTracker();
    }
  );
}

// Department Add Remove View //

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter department name: ",
      },
    ])
    .then(function (answer) {
      console.log(answer.departmentName);

      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.departmentName,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
        }
      );
      runTracker();
    });
}

function removeDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter department name: ",
      },
    ])
    .then(function (answer) {
      console.log(answer.departmentName);
      connection.query(
        "DELETE FROM department WHERE ?",
        {
          name: answer.departmentName,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
        }
      );
      runTracker();
    });
}

function allDepartments() {
  console.log("Selecting all Departments...\n");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    res.forEach((res) => console.log(JSON.parse(JSON.stringify(res.name))));
  });
  runTracker();
}

// Role Add Remove View //

function addRole() {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter role title: ",
      },
    ])
    .then(function (answer) {
      console.log(answer.roleTitle);

      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.roleTitle,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
        }
      );
      runTracker();
    });
}

function removeRole() {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter role name: ",
      },
    ])
    .then(function (answer) {
      console.log(answer.roleTitle);

      connection.query(
        "DELETE FROM role WHERE ?",
        {
          title: answer.roleTitle,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
        }
      );
      runTracker();
    });
}

function allRoles() {
  console.log("Selecting all Roles...\n");
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    res.forEach((res) => console.log(JSON.parse(JSON.stringify(res.title))));
  });
  runTracker();
}

// Update Employee Role & Manager //

function updateRole() {
  connection.query(
    "SELECT first_name, last_name, id FROM employees",
    function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "emp_prompt",
            type: "rawlist",
            message: "Select an employee",
            choices: empChoicesArray(res),
          },
        ])
        .then(function (answer) {
          console.log(answer.emp_prompt);
          var answerId = [answer.emp_prompt];
          var empResult = answerId[0]
            .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
            .map(Number);

          console.log(empResult);

          connection.query("SELECT title, id FROM role", function (err, res) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "urole_prompt",
                  type: "rawlist",
                  message: "Select a role for employee",
                  choices: roleChoicesArray(res),
                },
              ])
              .then(function (answer) {
                console.log(answer.urole_prompt);
                var answerId = [answer.urole_prompt];
                var uroleResult = answerId[0]
                  .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
                  .map(Number);

                console.log(uroleResult);

                connection.query(
                  "UPDATE employees SET ? WHERE ?",
                  [
                    {
                      role_id: uroleResult,
                    },
                    {
                      id: empResult,
                    },
                  ],
                  function (error) {
                    if (error) throw err;
                    console.log("Role updated!");
                  }
                );
                runTracker();
              });
          });
        });
    }
  );
}

// Construction //

//
//

//

// Promises //

/*

const roleFromDept = new Promise((resolve) => {
  var query = "SELECT id FROM role WHERE ?";
  connection.query(query, { department_id: dresult }, function (err, res) {
    if (err) throw err;
    var salaryIds = [];
    res.forEach((res) => salaryIds.push(res.id));
    resolve(salaryIds);
  });
});

const roleFromEmp = new Promise((resolve) => {
  const salaryRoleId = [];
  salaryIds.forEach((salaryId) => {
    var query = "SELECT id, role_id FROM employees WHERE ?";
    connection.query(query, { role_id: salaryId }, function (err, res) {
      if (err) throw err;
      var bresult = Object.values(JSON.parse(JSON.stringify(res)));
      bresult.forEach((v) => {
        salaryRoleId.push(v.role_id);
      });
      resolve(salaryRoleId);
    });
  });
});

const empSalary = new Promise((resolve) => {
  salaryRoleId.forEach((salaryRoleId) => {
    var query = "SELECT salary FROM role WHERE ?";
    connection.query(query, { id: salaryRoleId }, function (err, res) {
      if (err) throw err;
      const salaryArray = [];
      var sresult = Object.values(JSON.parse(JSON.stringify(res)));
      console.log(sresult, "sresult");
      sresult.forEach((v) => {
        salaryArray.push(v.salary);
        resolve(salaryArray);
      });
    });
  });
});

*/

// Utilities //

function mngrChoicesArray(res) {
  var choiceArray = [];
  for (var i = 0; i < res.length; i++) {
    choiceArray.push(
      `${res[i].first_name} ${res[i].last_name}, Employee ID: ${res[i].id}`
    );
  }
  return choiceArray;
}

function roleChoicesArray(res) {
  var choiceArray = [];
  for (var i = 0; i < res.length; i++) {
    choiceArray.push(`Title: ${res[i].title}  Role ID: ${res[i].id}`);
  }
  return choiceArray;
}

//

function deptChoicesArray() {
  connection.query("SELECT name, id FROM department", function (err, res) {
    if (err) throw err;
    var choiceArray = [];
    for (var i = 0; i < res.length; i++) {
      choiceArray.push(`Name: ${res[i].name}  ID: ${res[i].id}`);
    }
    console.log(choiceArray);
    return choiceArray;
  });
}

function empChoicesArray(res) {
  var choiceArray = [];
  for (var i = 0; i < res.length; i++) {
    choiceArray.push(
      `ID: ${res[i].id}  Name: ${res[i].first_name} ${res[i].last_name}`
    );
  }
  return choiceArray;
}

//

// deptBudget Original //

/*

function deptBudget() {
  connection.query("SELECT name, id FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "dept_prompt",
          type: "rawlist",
          message: "Select a Department",
          choices: deptChoicesArray(res),
        },
      ])
      .then(function (answer) {
        var answerId = [answer.dept_prompt];
        console.log(answerId, "answerId");
        var dresult = answerId[0]
          .match(/[-+]?[0-9]*\.?[0-9]+/g, " ")
          .map(Number);

        var query = "SELECT id FROM role WHERE ?";
        connection.query(
          query,
          { department_id: dresult },
          function (err, res) {
            if (err) throw err;
            var salaryIds = [];
            res.forEach((res) => salaryIds.push(res.id));
            console.log(salaryIds);

            const salaryRoleId = [];
            salaryIds.forEach((salaryId) => {
              var query = "SELECT id, role_id FROM employees WHERE ?";
              connection.query(
                query,
                { role_id: salaryId },
                function (err, res) {
                  if (err) throw err;
                  var bresult = Object.values(JSON.parse(JSON.stringify(res)));
                  bresult.forEach((v) => {
                    salaryRoleId.push(v.role_id);
                  });
                  console.log(salaryRoleId, "sri");
                }
              );

              salaryRoleId.forEach((salaryRoleId, index) => {
                var query = "SELECT salary FROM role WHERE ?";
                connection.query(
                  query,
                  { id: salaryRoleId },
                  function (err, res) {
                    if (err) throw err;
                    const salaryArray = [];
                    var sresult = Object.values(
                      JSON.parse(JSON.stringify(res))
                    );
                    console.log(sresult, "sresult");
                    sresult.forEach((v) => {
                      salaryArray.push(v.salary);
                      console.log(salaryArray);
                    });
                    console.log(salaryArray);
                    const finalResult = [];
                    if (index >= salaryArray.length - 1) {
                      " Departmant total budget is: ",
                        finalResult.push(salaryArray.reduce((a, b) => a + b));
                    }
                    console.log(salaryArray, "final");
                  }
                );
              });
            });
          }
        );
        runTracker();
      });
  });
}
*/
