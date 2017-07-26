var localDB = [];

function ready() {
  getCSV();
}

function getCSV() {
  axios.get("https://docs.google.com/spreadsheets/d/1N9iSbV7yMQWR886z6qOK5g9lLyAUHXHmu_6MsZne_Bs/pub?gid=507572218&single=true&output=csv")
    .then(function(response) {
      formatLocalDB(response.data);
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
  tempDB.forEach(function(e) {
    var element = e.split(",");
    localDB.push({task: element[1], currentStatus: element[2]});
  });
  console.log(localDB);
}
