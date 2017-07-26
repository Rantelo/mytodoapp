var localDB = {};
var poller;

function ready() {
  getCSV();
  setRandomId();
}

function getCSV() {
  axios.get("https://docs.google.com/spreadsheets/d/1N9iSbV7yMQWR886z6qOK5g9lLyAUHXHmu_6MsZne_Bs/pub?gid=507572218&single=true&output=csv")
    .then(function(response) {
      formatLocalDB(response.data);
      resetPoller();
    })
}

function formatLocalDB(data) {
  var tempDB = data.split("\n");
  if (tempDB[0].includes("Marca temporal") ||
      tempDB[0].includes("task") ||
      tempDB[0].includes("status")
  ) {
    tempDB.shift();
  }
  localDB = {};
  tempDB.forEach(function(e) {
    var element = e.split(",");
    var id = parseInt(element[3]);
    localDB[id] = {
      task: element[1],
      currentStatus: element[2]
    }
  });
  refreshView();
}

function refreshView() {
  var todolist = document.getElementById("todolist");

  setRandomId();
  while (todolist.firstChild) {
    todolist.removeChild(todolist.firstChild);
  }
  Object.keys(localDB).forEach(function(key) {
    var div = document.createElement("div");
    var currentStatus = localDB[key].currentStatus.trim();
    var currentClass = (currentStatus == "done") ? "crossed" : "";

    div.setAttribute("status", currentStatus);
    div.setAttribute("class", currentClass);
    div.innerHTML = localDB[key].task;
    div.setAttribute("id", key);
    div.setAttribute("onclick", "handleToggle("+key+");");

    todolist.appendChild(div);
  });
}

function handleSubmit() {
  var newtodo = document.getElementById("newtodo").value;
  var id = document.getElementById("taskid").value;
  var status = document.getElementById("taskstatus").value;

  localDB[parseInt(id)] = {
    task: newtodo,
    currentStatus: status
  }
  setTimeout(function() {
    refreshView()
    resetPoller();
  }, 200);

  return true;
}

function handleToggle(taskid) {
  var task = document.getElementById(taskid);
  var entry_task = task.textContent;
  var entry_status = task.getAttribute("status");
  var new_entry_status = (entry_status === "pending") ? "done" : "pending";

  document.getElementById("newtodo").value = entry_task;
  document.getElementById("taskstatus").value = new_entry_status;
  document.getElementById("taskid").value = taskid;
  document.getElementById("gform").submit();

  localDB[parseInt(taskid)] = {
    task: entry_task,
    currentStatus: new_entry_status
  };
  refreshView()
  resetPoller();
}

function setRandomId() {
  document.getElementById("taskid").value = Math.round(Math.random() * 1000000);
  document.getElementById("newtodo").value = "";
  document.getElementById("taskstatus").value = "pending";
}

function resetPoller() {
   clearInterval(poller);
   setInterval(function() {
     getCSV();
   }, 305000);
}
