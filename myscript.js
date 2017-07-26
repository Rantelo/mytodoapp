var localDB = [];
var poller;

function ready() {
  getCSV();
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
  localDB = [];
  tempDB.forEach(function(e) {
    var element = e.split(",");
    localDB.push({task: element[1], currentStatus: element[2]});
  });
  refreshView();
}

function refreshView() {
  var todolist = document.getElementById("todolist");

  while (todolist.firstChild) {
    todolist.removeChild(todolist.firstChild);
  }
  localDB.forEach(function(e) {
    var div = document.createElement("div");
    var currentStatus = e.currentStatus.trim();
    var currentClass = (currentStatus == "done") ? "crossed" : "";

    div.setAttribute("status", currentStatus);
    div.setAttribute("class", currentClass);
    div.innerHTML = e.task;

    todolist.appendChild(div);
  })
}

function resetPoller() {
   clearInterval(poller);
   setInterval(function() {
     getCSV();
   }, 305000);
}
