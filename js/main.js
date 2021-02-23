var $pressHereButton = document.querySelector('.press-here');
var $modal = document.querySelector('.modal-background');
$pressHereButton.addEventListener('click', function (event) {
  $modal.className = 'modal-background';
});

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
// xhr.responseType = 'json';
// xhr.addEventListener('load', function() {
//   console.log('status:', xhr.status);
//   console.log('response:', xhr.response);
// });
// xhr.send();
