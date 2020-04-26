const express = require("express");
var path = require('path');
const hbs = require("hbs");
const JSONparser = express.json();
const app = express();
let task = {taskName:"taskName", completionTime:"completionTime", status:"0"};
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/js")));
app.get("/lab1", (request, response) => {
    //response.render("main");
    response.render("main", {
        _taskName: task.taskName,
        _completionTime: task.completionTime,
        _status: task.status
    });
})

app.post("/lab1", JSONparser, (request, response) => {

    console.log(`${request.body.taskName}(${request.body.completionTime})`);
    task.taskName = request.body.taskName;
    task.completionTime = request.body.completionTime;
});

app.listen(8088, () => {
    console.log("Server started at port 8088");
});