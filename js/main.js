var $pressHereButton = document.querySelector('.press-here');
var $modal = document.querySelector('.modal-background');
var $appName = document.querySelector('.app-name');
var $buttonContainer = document.querySelector('.button-container');

$pressHereButton.addEventListener('click', function (event) {
  $modal.className = 'modal-background';
  $pressHereButton.textContent = '';
  $appName.className = 'hidden app-name';
});

$buttonContainer.addEventListener('click', function (event) {
  // console.log(event.target.tagName);
});

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
// xhr.responseType = 'json';
// xhr.addEventListener('load', function() {
//   console.log('status:', xhr.status);
//   console.log('response:', xhr.response);
// });
// xhr.send();
