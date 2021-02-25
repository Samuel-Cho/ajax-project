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
  pokemon_name: null,
  image: null,
  types: [],
  flavorText: null
};
var divPokemonPage = null;

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
      pokemon_name: null,
      image: null,
      types: [],
      flavorText: null
    };
    for (var x = 0; x < $region.length; x++) {
      $region[x].className = 'region';
    }
    kantoOl.className = 'hidden pokemon-list kanto-list';
    johtoOl.className = 'hidden pokemon-list johto-list';
    pokemonObject.pokemon_name = event.target.id;
    divPokemonPage = createPokemonPage(pokemonObject);
    pokemonTypeImage(event.target.id);
    var $pokemonPage = document.querySelector('.pokemon-page');
    if ($pokemonPage === null) {
      $listContainer.appendChild(divPokemonPage);
    } else {
      $pokemonPage.replaceWith(divPokemonPage);
    }
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
    var imgPokemon = document.createElement('img');
    imgPokemon.setAttribute('class', 'pokemon-img');
    imgPokemon.setAttribute('src', pokemonObject.image);
    imgPokemon.setAttribute('alt', 'Pokemon Image');
    divPokemonPage.appendChild(imgPokemon);

    var divPokemonNTContainer = document.createElement('div');
    divPokemonNTContainer.setAttribute('class', 'pokemon-nt-container');
    divPokemonPage.appendChild(divPokemonNTContainer);

    var pPokemonName = document.createElement('p');
    pPokemonName.setAttribute('class', 'pokemon-name');
    var tnPokemonName = document.createTextNode(capitalize(pokemonObject.pokemon_name));
    pPokemonName.appendChild(tnPokemonName);
    divPokemonNTContainer.appendChild(pPokemonName);

    var pPokemonTypes = document.createElement('p');
    pPokemonTypes.setAttribute('class', 'pokemon-types');
    var typesVar = '';
    for (var y = 0; y < pokemonObject.types.length; y++) {
      typesVar += capitalize(pokemonObject.types[y]) + '/';
    }
    typesVar = typesVar.slice(0, typesVar.length - 1);
    var tnPokemonTypes = document.createTextNode(typesVar);
    pPokemonTypes.appendChild(tnPokemonTypes);
    divPokemonNTContainer.appendChild(pPokemonTypes);

    pokemonFlavorText(id);
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
    var pPokemonFT = document.createElement('p');
    pPokemonFT.setAttribute('class', 'pokemon-flavor-text');
    var tnPokemonFT = document.createTextNode(pokemonObject.flavorText);
    pPokemonFT.appendChild(tnPokemonFT);
    divPokemonPage.appendChild(pPokemonFT);

    var buttonNotCaught = document.createElement('button');
    buttonNotCaught.setAttribute('class', 'not-caught');
    divPokemonPage.appendChild(buttonNotCaught);
  });
  xhrFlavorText.send();
}

function createPokemonPage(pokemonObject) {
  var divPokemonEntry = document.createElement('div');
  divPokemonEntry.setAttribute('class', 'pokemon-page');
  return divPokemonEntry;
}
