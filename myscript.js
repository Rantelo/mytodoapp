var localDB = [];

function ready() {
  getCSV();
}

function getCSV() {
  axios.get("https://docs.google.com/spreadsheets/d/1N9iSbV7yMQWR886z6qOK5g9lLyAUHXHmu_6MsZne_Bs/pub?gid=507572218&single=true&output=csv")
    .then(function(response) {
      localDB = response.data;
      console.log(localDB);
    })

}
