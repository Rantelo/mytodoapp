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

    todolist.appendChild(div);
  });
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
