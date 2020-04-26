const express = require("express");
var path = require('path');
const hbs = require("hbs");
const JSONparser = express.json();
const app = express();
let task = new Array();
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper("createTaskList", (tasks) => {
    let list = "";
    for (let i = 0; i < tasks.length; i++) {
        list += "<div class=\"task\">" +
            "<h3>" + tasks[i].taskName + "</h3>" +
            "<p>" + tasks[i].completionTime + "</p>" +
            "<p>" + tasks[i].status + "</p>" +
            "</div>"
    }
    return new hbs.SafeString(list);
});

app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/js")));
app.get("/lab1", (request, response) => {
    //response.render("main");
    response.render("main", {task});
});

app.post("/lab1", JSONparser, (request, response) => {

    // console.log(`${request.body.taskName}(${request.body.completionTime})`);
    task[task.length] = request.body;

    for(let i=0; i<task.length; i++)
    {
        console.log(`${task[i].taskName}(${task[i].completionTime})`);
    }
});

app.listen(8088, () => {
    console.log("Server started at port 8088");
});