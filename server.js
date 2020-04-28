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

const divDone = "<div class=\"task\" style=\"background-color:lightblue\">";
const divInProc = "<div class=\"task\" style=\"background-color:lightcoral\">";
hbs.registerHelper("createTaskList", (tasks) => {
    let list = "";
    let divStyle = "";
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status == "in process")
            divStyle = divInProc;
        else
            divStyle = divDone;
        list += divStyle +
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
let status = "all";
const sqlSelectRequestWhere = "SELECT taskName, completionTime, completionDate, status FROM tasks WHERE status = ?";
const sqlSelectRequest = "SELECT taskName, completionTime, completionDate, status FROM tasks";

app.use("/sts", (request, response) => {
    status = request.query.status;
    response.redirect("/lab1");
});

app.get("/lab1", (request, response) => {
    if (status == "all")
    DBconnection.query(sqlSelectRequest, (err, results) => {
        if (err) console.error("Error(DB):" + err);
        else task = results;
        response.render("main", { task });
    });
    else
    DBconnection.query(sqlSelectRequestWhere, status, (err, results) => {
        if (err) console.error("Error(DB):" + err);
        else task = results;
        response.render("main", { task });
    });
});

const sqlInsertRequest = "INSERT INTO tasks(taskName, completionDate, completionTime) VALUES(?, ?, ?)";
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