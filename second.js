var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Poly4654!",
  database: "employeeTracker_db",
});

async function deptPrompt() {
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
        console.log(dresult);
        return dresult;
      });
  });
}

async function deptBudget() {
  try {
    let prompt = await deptPrompt();
  } catch (err) {}
}

deptPrompt();

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
          choices: deptChoicesArray(),
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

function deptChoicesArray(res) {
  var choiceArray = [];
  for (var i = 0; i < res.length; i++) {
    choiceArray.push(`Name: ${res[i].name}  ID: ${res[i].id}`);
  }
  console.log(choiceArray);
  return choiceArray;
}
