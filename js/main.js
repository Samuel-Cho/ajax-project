var $pressHereButton = document.querySelector('.press-here');
var $modal = document.querySelector('.modal-background');
var $appName = document.querySelector('.app-name');
var $buttonContainer = document.querySelector('.button-container');
var $pokemonList = document.querySelector('.pokemon-list');

$pressHereButton.addEventListener('click', function (event) {
  $modal.className = 'modal-background';
  $pressHereButton.textContent = '';
  $appName.className = 'hidden app-name';
});

$buttonContainer.addEventListener('click', function (event) {
  // console.log(event.target.tagName);
});

// function createList(pokemonEntry) {
//   var liPokemon = document.createElement('li');
//   li
// }

// function capitalize(word) {
//   var capitalizedWord = '';
//   var i = 0;
//   while (i < word.length) {
//     if (i === 0) {
//       capitalizedWord += word[i].toUpperCase();
//     } else {
//       capitalizedWord += word[i].toLowerCase();
//     }
//     i++;
//   }
//   return capitalizedWord;
// }

var kantoList = [];
// var johtoList = [];
// var caughtList = [];

if ($pokemonList.className === 'pokemon-list kanto-list') {
  var xhrKanto = new XMLHttpRequest();
  xhrKanto.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
  xhrKanto.responseType = 'json';
  xhrKanto.addEventListener('load', function () {
    for (var kantoIndex = 0; kantoIndex < 151; kantoIndex++) {
      kantoList.push(xhrKanto.response.pokemon_entries[kantoIndex].pokemon_species.name);
    }
    // console.log('kantoList:', kantoList);
  });
  xhrKanto.send();
}

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
// xhr.responseType = 'json';
// xhr.addEventListener('load', function() {
//   console.log('status:', xhr.status);
//   console.log('response:', xhr.response);
//   console.log('test:', xhr.response.pokemon_entries[0].pokemon_species.name)
// });
// xhr.send();
