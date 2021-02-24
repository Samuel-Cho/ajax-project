var $pressHereButton = document.querySelector('.press-here');
var $modal = document.querySelector('.modal-background');
var $appName = document.querySelector('.app-name');
var $buttonContainer = document.querySelector('.button-container');
var $region = document.querySelectorAll('.region');
var $listContainer = document.querySelector('.list-container');
var kantoList = [];
var johtoList = [];
// var caughtList = [];
var kantoOl = null;
var johtoOl = null;
var pokemonObject = {
  pokemon_id: null,
  image: null,
  types: [],
  flavorText: null
};

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
      kantoOl.className = 'pokemon-list kanto-list';
      johtoOl.className = 'hidden pokemon-list johto-list';
    } else if (closestRegion.id === 'johto') {
      kantoOl.className = 'hidden pokemon-list kanto-list';
      johtoOl.className = 'pokemon-list johto-list';
    } else {
      // for caught list
    }
  }
});

function createList(pokemonEntry) {
  var liPokemon = document.createElement('li');
  liPokemon.setAttribute('class', 'pokemon-entry');
  liPokemon.setAttribute('id', pokemonEntry.toLowerCase());
  var pokemonName = document.createTextNode(pokemonEntry);
  liPokemon.appendChild(pokemonName);
  return liPokemon;
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

function kantoDex() {
  var xhrKanto = new XMLHttpRequest();
  xhrKanto.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
  xhrKanto.responseType = 'json';
  xhrKanto.addEventListener('load', function () {
    kantoOl = document.createElement('ol');
    kantoOl.setAttribute('class', 'pokemon-list kanto-list');
    for (var kantoIndex = 0; kantoIndex < 151; kantoIndex++) {
      kantoList.push(capitalize(xhrKanto.response.pokemon_entries[kantoIndex].pokemon_species.name));
      var kantoLi = createList(kantoList[kantoIndex]);
      kantoOl.appendChild(kantoLi);
    }
    $listContainer.appendChild(kantoOl);
  });
  xhrKanto.send();
}

kantoDex();

function johtoDex() {
  var xhrJohto = new XMLHttpRequest();
  xhrJohto.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
  xhrJohto.responseType = 'json';
  xhrJohto.addEventListener('load', function () {
    johtoOl = document.createElement('ol');
    johtoOl.setAttribute('class', 'hidden pokemon-list johto-list');
    johtoOl.setAttribute('start', '152');
    for (var johtoIndex = 151; johtoIndex < 251; johtoIndex++) {
      johtoList.push(capitalize(xhrJohto.response.pokemon_entries[johtoIndex].pokemon_species.name));
    }
    for (var j = 0; j < johtoList.length; j++) {
      var johtoLi = createList(johtoList[j]);
      johtoOl.appendChild(johtoLi);
    }
    $listContainer.appendChild(johtoOl);
  });
  xhrJohto.send();
}

johtoDex();

$listContainer.addEventListener('click', function pokemonPage(target) {
  if (event.target.matches('li')) {
    pokemonObject = {
      pokemon_id: null,
      image: null,
      types: [],
      flavorText: null
    };
    pokemonObject.pokemon_id = event.target.id;
    pokemonTypeImage(event.target.id);
    pokemonFlavorText(event.target.id);
    // console.log(pokemonObject);
    for (var x = 0; x < $region.length; x++) {
      $region[x].className = 'region';
    }
    kantoOl.className = 'hidden pokemon-list kanto-list';
    johtoOl.className = 'hidden pokemon-list johto-list';
    return pokemonObject;
  }
});

function pokemonTypeImage(id) {
  var xhrTypeImage = new XMLHttpRequest();
  xhrTypeImage.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhrTypeImage.responseType = 'json';
  xhrTypeImage.addEventListener('load', function () {
    pokemonObject.image = xhrTypeImage.response.sprites.other['official-artwork'].front_default;
    for (var typeIndexAPI = 0; typeIndexAPI < xhrTypeImage.response.types.length; typeIndexAPI++) {
      pokemonObject.types.push(xhrTypeImage.response.types[typeIndexAPI].type.name);
    }
  });
  xhrTypeImage.send();
}

function pokemonFlavorText(id) {
  var xhrFlavorText = new XMLHttpRequest();
  xhrFlavorText.open('GET', 'https://pokeapi.co/api/v2/pokemon-species/' + id);
  xhrFlavorText.responseType = 'json';
  xhrFlavorText.addEventListener('load', function () {
    for (var ftIndex = (xhrFlavorText.response.flavor_text_entries.length - 1); ftIndex >= 0; ftIndex--) {
      if (xhrFlavorText.response.flavor_text_entries[ftIndex].language.name === 'en') {
        pokemonObject.flavorText = xhrFlavorText.response.flavor_text_entries[ftIndex].flavor_text;
        break;
      }
    }
  });
  xhrFlavorText.send();
}
