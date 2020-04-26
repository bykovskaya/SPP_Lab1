document.getElementById("submitButton").addEventListener("click", function (e) {
    //e.preventDefault();
    // получаем данные формы
    let addTaskForm = document.forms["addTaskForm"];
    let taskName = addTaskForm.elements["taskName"].value;
    let completionTime = addTaskForm.elements["completionTime"].value;
    // сериализуем данные в json
    let task = JSON.stringify({
        taskName: taskName,
        completionTime: completionTime
    });
    let request = new XMLHttpRequest();
    
    request.open("POST", "/lab1", true);
    request.setRequestHeader("Content-Type", "application/json");
    //request.addEventListener("load",  (request, response) => {});
    request.send(task);
    
});