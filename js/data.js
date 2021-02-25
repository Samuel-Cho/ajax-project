/* exported data */

var data = {
  caughtList: []
};

var previousCaughtList = localStorage.getItem('data-caught-list');
if (previousCaughtList !== null) {
  data = JSON.parse(previousCaughtList);
}

function storeCaughtList(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-caught-list', dataJSON);
}

window.addEventListener('beforeunload', storeCaughtList);
