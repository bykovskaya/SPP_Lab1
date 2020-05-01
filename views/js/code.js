document.getElementById("submitButton").addEventListener("click", function (e) {
    e.preventDefault();
    // получаем данные формы

    let addTaskForm = document.forms["addTaskForm"];
    let taskName = addTaskForm.elements["taskName"].value;
    let completionTime = addTaskForm.elements["completionTime"].value;
    let uploadingFileName = addTaskForm.elements["uploadingFile"].value;
    let form = new FormData();
    form.append("taskName", taskName);
    form.append("completionTime", completionTime);
    let val = document.getElementById("uploadingFile").files[0];
    form.append("uploadingFile", val, uploadingFileName);

    // // сериализуем данные в json
    // let task = JSON.stringify({
    //     taskName: taskName,
    //     completionTime: completionTime
    // });

    let request = new XMLHttpRequest();
    request.open("POST", "/lab1", true);
    //request.setRequestHeader("Content-Type", "application/json");

    request.send(form);

});

const statusSelectField = document.getElementById("status");
statusSelectField.addEventListener("change", (e) => {
    let selectedStatus = statusSelectField.value;

    let request = new XMLHttpRequest();
    function reqReadyStateChange() {
        if (request.readyState == 4) {
            var statusCode = request.status;
            if (statusCode == 200) {
                location.reload();
            }
        }
    }
    request.open("get", "/sts?status=" + selectedStatus, true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
});

const sortParamSelectField = document.getElementById("sortParam");
sortParamSelectField.addEventListener("change", (e) => {
    let parametr = sortParamSelectField.value;

    let request = new XMLHttpRequest();
    function reqReadyStateChange() {
        if (request.readyState == 4) {
            var statusCode = request.status;
            if (statusCode == 200) {
                location.reload();
            }
        }
    }
    request.open("get", "/sort?param=" + parametr, true);
    request.onreadystatechange = reqReadyStateChange;
    request.send();
});