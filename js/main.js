var $pressHereButton = document.querySelector('.press-here');
var $modal = document.querySelector('.modal-background');
var $appName = document.querySelector('.app-name');
var $buttonContainer = document.querySelector('.button-container');
var $region = document.querySelectorAll('.region');
var $pokemonList = document.querySelector('.pokemon-list');

$pressHereButton.addEventListener('click', function (event) {
  $modal.className = 'modal-background';
  $pressHereButton.textContent = '';
  $appName.className = 'hidden app-name';
});

$buttonContainer.addEventListener('click', function (event) {
  if (event.target.matches('button') || event.target.matches('p')) {
    var closestRegion = event.target.closest('.region');
    for (var regionIndex = 0; regionIndex < $region.length; regionIndex++) {
      $region[regionIndex].className = 'region';
    }
    closestRegion.className = 'select region';
    if (closestRegion.id === 'kanto') {
      $pokemonList.className = 'pokemon-list kanto-list';
    } else if (closestRegion.id === 'johto') {
      $pokemonList.className = 'pokemon-list johto-list';
    } else {
      $pokemonList.className = 'pokemon-list caught-list';
    }
  }
});

function createList(pokemonEntry) {
  var liPokemon = document.createElement('li');
  liPokemon.setAttribute('class', 'pokemon-entry');
  var pokemonName = document.createTextNode(pokemonEntry);
  liPokemon.appendChild(pokemonName);
  $pokemonList.appendChild(liPokemon);
}

function capitalize(word) {
  var capitalizedWord = '';
  var i = 0;
  while (i < word.length) {
    if (i === 0) {
      capitalizedWord += word[i].toUpperCase();
    } else {
      capitalizedWord += word[i].toLowerCase();
    }
    i++;
  }
  return capitalizedWord;
}

var kantoList = [];
var johtoList = [];
// var caughtList = [];
// var kantoNode = null;
// var johtoNode = null;

var xhrKanto = new XMLHttpRequest();
xhrKanto.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
xhrKanto.responseType = 'json';
xhrKanto.addEventListener('load', function () {
  for (var kantoIndex = 0; kantoIndex < 151; kantoIndex++) {
    kantoList.push(capitalize(xhrKanto.response.pokemon_entries[kantoIndex].pokemon_species.name));
    createList(kantoList[kantoIndex]);
  }
});
xhrKanto.send();

var xhrJohto = new XMLHttpRequest();
xhrJohto.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
xhrJohto.responseType = 'json';
xhrJohto.addEventListener('load', function () {
  for (var johtoIndex = 151; johtoIndex < 251; johtoIndex++) {
    johtoList.push(capitalize(xhrJohto.response.pokemon_entries[johtoIndex].pokemon_species.name));
    createList(johtoList[johtoIndex]);
  }
});
xhrJohto.send();
