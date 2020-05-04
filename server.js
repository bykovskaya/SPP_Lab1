const express = require("express");
var path = require('path');
const hbs = require("hbs");
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
        "." + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        "." + date.getFullYear();
}

function getNormalTime(argTime) {
    let normalTime = "";
    let date = new Date(argTime);

    return normalTime = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" + (date.getMinutes() + 1 < 10 ? "0" + date.getMinutes() : date.getMinutes());
}

function ru_status(status) {
    switch (status) {
        case "all":
            return "все";
            break;
        case "in process":
            return "в процессе";
            break;
        case "done":
            return "выполненные";
            break;
    }
};

function ru_paramValue(val) {
    switch (val) {
        case "byTname":
            return "названию";
            break;
        case "byComplTime":
            return "времени завершения";
            break;
    }
}

function fSort(tasks, sortParam) {
    switch (sortParam) {
        case "byAddTime":
            tasks.sort((task1, task2) => {
                if (task1.taskName > task2.taskName)
                    return 1;
                if (task1.taskName < task2.taskName)
                    return -1;
                if (task1.taskName == task2.taskName)
                    return 0;
            });
            break;
        case "byTname":
            tasks.sort((task1, task2) => {
                if (task1.taskName > task2.taskName)
                    return 1;
                if (task1.taskName < task2.taskName)
                    return -1;
                if (task1.taskName == task2.taskName)
                    return 0;
            });
            break;

        case "byComplTime":
            tasks.sort((task1, task2) => {
                if (task1.completionTime > task2.completionTime)
                    return 1;
                if (task1.completionTime < task2.completionTime)
                    return -1;
                if (task1.completionTime == task2.completionTime)
                    return 0;
            });
            break;
    }
}

/*generates html for tasks*/
const divDone = "<div class=\"task\" style=\"background-color:lightblue\">";
const divInProc = "<div class=\"task\" style=\"background-color:coral\">";
hbs.registerHelper("createTaskList", (tasks) => {
    let list = "";
    let div = "";
    let link;
    fSort(tasks, parametrValue);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status == "in process")
            div = divInProc;
        else {
            div = divDone;

        }
        if (task[i].file != null) {
            filePath = "/Lab1/uploads?uploadingFile=" + encodeURIComponent(task[i].file);            
            link = `<a href=${filePath}>` + "file" + "</a>";
        }
        else link = "";
        list += div + "<h3>" + tasks[i].taskName + "</h3>" +
            "<p>" + getNormalDate(tasks[i].completionTime) + "</p>" +
            "<p>" + getNormalTime(tasks[i].completionTime) + "</p>" +
            link + "</div>"
    }
    return new hbs.SafeString(list);
});

/*attaches static files to page*/
app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/js")));
/*******************************/

let task = new Array();
let status = "all";
let parametrValue = "byTname";
const sqlSelectRequestWhere = "SELECT taskName, completionTime, file, status FROM tasks WHERE status = ?";
const sqlSelectRequest = "SELECT taskName, completionTime, file, status FROM tasks";

app.use("/sts", (request, response) => {
    status = request.query.status;
    response.redirect("/lab1");
});

app.use("/sort", (request, response) => {
    parametrValue = request.query.param;
    response.redirect("/lab1");
});

app.use("/Lab1/uploads", (req, resp) => {
    let filename = req.query.uploadingFile;
    let fpath = __dirname + "\\uploads\\" + decodeURIComponent(filename);

    console.log(fpath);
    
    resp.download(fpath);
});

let warningMess = "";
app.get("/lab1", (request, response) => {

    if (status == "all")
        DBconnection.query(sqlSelectRequest, (err, results) => {
            if (err) console.error("Error(DB01):" + err);
            else task = results;
            response.render("main", {
                task,
                selectedStatus: ru_status(status),
                selectedParametr: ru_paramValue(parametrValue),
                warning: warningMess
            });
        });
    else
        DBconnection.query(sqlSelectRequestWhere, status, (err, results) => {
            if (err) console.error("Error(DB02):" + err);
            else task = results;
            response.render("main", {
                task,
                selectedStatus: ru_status(status),
                selectedParametr: ru_paramValue(parametrValue),
                warning: warningMess
            });
        });
});

const sqlInsertRequest = "INSERT INTO tasks(taskName, completionTime, file) VALUES(?, ?, ?)";

const multer = require("multer");
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
app.use(express.static(__dirname));
app.use(multer({ storage: storageConfig }).single("uploadingFile"));

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/lab1", urlencodedParser, (request, response) => {
    let filedata;

    if (request.file) {
        filedata = request.file;
        //console.log(filedata.originalname);

    }
    // console.log(request.body.taskName);
    // console.log(request.body.completionTime);

    ///////////////////////////////////////////////////////////
    //добавление пути к файлу в БД
    //подгрузка файлов на страницу
    ///////////////////////////////////////////////////////////

    let arg = [request.body.taskName,
    request.body.completionTime];
    if (request.file)
        arg[2] = filedata.filename;

    let emptyFields = false;
    for (let i = 0; i < arg.length - 1; i++) {
        if (arg[i] == '') {
            emptyFields = true;
        }
    }
    // console.log(`${request.body.taskName}(${request.body.completionTime})`);
    if (!emptyFields) {
        DBconnection.query(sqlInsertRequest, arg, (err, results) => {
            if (err) console.error("Error(DB2): ", err.message);
            else console.log("Data added!");
            warningMess = "";
        });
    }
    else warningMess = "Заполните все поля формы!";
});

app.listen(8088, () => {
    console.log("Server started at port 8088");
});