const express = require("express");
var path = require('path');
const hbs = require("hbs");
const JSONparser = express.json();
const app = express();
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

const mysql = require("mysql2");
const DBconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "tasks_spp_Lab1",
    password: "er54z4q9"
});
DBconnection.connect((err) => {
    if (err)
        return console.error("Error: " + err.message);
    else
        console.log("Successfully connected!");
});

// DBconnection.end((err) => {
//     if (err)
//         return console.error("Error: " + err.message);
//     else
//         console.log("Connection is closed!");
// });

function getNormalDate(argDate) {
    let normalDate = "";
    let date = new Date(argDate);

    return normalDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "." + (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) +
        "." + date.getFullYear();
}

/*generates html for tasks*/
hbs.registerHelper("createTaskList", (tasks) => {
    let list = "";

    for (let i = 0; i < tasks.length; i++) {

        list += "<div class=\"task\">" +
            "<h3>" + tasks[i].taskName + "</h3>" +
            "<p>" + getNormalDate(tasks[i].completionDate) + "</p>" +
            "<p>" + tasks[i].completionTime + "</p>" +
            "</div>"
    }
    return new hbs.SafeString(list);
});

/*attaches static files to page*/
app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/js")));
/*******************************/

let task = new Array();

app.get("/lab1", (request, response) => {
    DBconnection.query("SELECT taskName, completionTime, completionDate, status FROM tasks", (err, results) => {
        console.error("Error(DB):" + err);
        task = results;
        response.render("main", { task });
    });
});

let sqlInsertRequest = "INSERT INTO tasks(taskName, completionDate, completionTime) VALUES(?, ?, ?)";
app.post("/lab1", JSONparser, (request, response) => {
    let arg = [request.body.taskName,
    request.body.completionDate,
    request.body.completionTime];
    // console.log(`${request.body.taskName}(${request.body.completionTime})`);
    DBconnection.query(sqlInsertRequest, arg, (err, results) => {
        if (err) console.error("Error: ", err.message);
        else console.log("Data added!");

    });
});

app.listen(8088, () => {
    console.log("Server started at port 8088");
});