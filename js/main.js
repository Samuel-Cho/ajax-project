var $pressHereButton = document.querySelector('.press-here');
var $modal = document.querySelector('.modal-background');
var $appName = document.querySelector('.app-name');
var $homepageText = document.querySelector('.homepage-text-container');
var $buttonContainer = document.querySelector('.button-container');
var $region = document.querySelectorAll('.region');
var $listContainer = document.querySelector('.list-container');
var $searchContainer = document.querySelector('.search-container');
var $searchListContainer = document.querySelector('.search-list-container');
var $kantoOl = document.querySelector('[data-region="kanto"]');
var $johtoOl = document.querySelector('[data-region="johto"]');
var $caughtOl = document.querySelector('[data-region="caught"]');
var ulSearch = null;
var nationalList = [];
var kantoList = [];
var johtoList = [];
var pokemonObject = {
  pokemon_name: null,
  image: null,
  types: [],
  flavorText: null,
  number: null
};
var divPokemonPage = null;
var $loading = document.querySelector('.loading');

$pressHereButton.addEventListener('click', function (event) {
  $modal.className = 'modal-background';
  $pressHereButton.textContent = '';
  $appName.className = 'hidden app-name';
  $homepageText.className = 'hidden homepage-text-container';
});

$buttonContainer.addEventListener('click', function (event) {
  if (event.target.matches('img') || event.target.matches('p')) {
    var closestRegion = event.target.closest('.region');
    for (var regionIndex = 0; regionIndex < $region.length; regionIndex++) {
      $region[regionIndex].className = 'region';
    }
    closestRegion.className = 'select region';
    var $pokemonPageHidden = document.querySelector('.pokemon-page');
    $listContainer.className = 'list-container';
    $searchContainer.className = 'hidden search-container';
    var $regionList = document.querySelectorAll('.region-list');
    if (closestRegion.id !== 'search') {
      $caughtOl.className = 'hidden caught-list';
      for (var b = 0; b < $regionList.length; b++) {
        if (closestRegion.id === $regionList[b].getAttribute('data-region')) {
          $regionList[b].className = 'region-list';
        } else {
          $regionList[b].className = 'hidden region-list';
        }
      }
      if ($pokemonPageHidden !== null) {
        $pokemonPageHidden.remove();
      }
      if (closestRegion.id === 'caught') {
        caughtDex(data);
      }
    } else {
      $listContainer.className = 'hidden list-container';
      $searchContainer.className = 'search-container';
    }
  }
});

function createListItem(pokemonEntry) {
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
  loadingGif();
  xhrKanto.addEventListener('load', function () {
    for (var kantoIndex = 0; kantoIndex < 151; kantoIndex++) {
      kantoList.push(capitalize(xhrKanto.response.pokemon_entries[kantoIndex].pokemon_species.name));
      nationalList.push(capitalize(xhrKanto.response.pokemon_entries[kantoIndex].pokemon_species.name));
      var kantoLi = createListItem(kantoList[kantoIndex]);
      $kantoOl.appendChild(kantoLi);
    }
    johtoDex();
  });
  xhrKanto.addEventListener('error', error => {
    console.error(error);
    const errorMessageList = document.createElement('p');
    errorMessageList.setAttribute('class', 'error-message-list');
    const errorTextList = document.createTextNode('Connection Error with API');
    errorMessageList.appendChild(errorTextList);
    $kantoOl.appendChild(errorMessageList);
    $johtoOl.appendChild(errorMessageList.cloneNode(true));
    loadingGif();
  });
  xhrKanto.send();
}

kantoDex();

function johtoDex() {
  var xhrJohto = new XMLHttpRequest();
  xhrJohto.open('GET', 'https://pokeapi.co/api/v2/pokedex/1/');
  xhrJohto.responseType = 'json';
  xhrJohto.addEventListener('load', function () {
    for (var johtoIndex = 151; johtoIndex < 251; johtoIndex++) {
      johtoList.push(capitalize(xhrJohto.response.pokemon_entries[johtoIndex].pokemon_species.name));
      nationalList.push(capitalize(xhrJohto.response.pokemon_entries[johtoIndex].pokemon_species.name));
    }
    for (var j = 0; j < johtoList.length; j++) {
      var johtoLi = createListItem(johtoList[j]);
      $johtoOl.appendChild(johtoLi);
    }
    loadingGif();
  });
  xhrJohto.send();
}

$listContainer.addEventListener('click', pokemonPage);

function pokemonPage(target) {
  if (event.target.matches('li') || event.target.className === 'caught-pokemon-img') {
    var selectedPokemon = event.target.closest('.pokemon-entry');
    pokemonObject = {
      pokemon_name: null,
      image: null,
      types: [],
      flavorText: null
    };
    for (var x = 0; x < $region.length; x++) {
      $region[x].className = 'region';
    }
    $kantoOl.className = 'hidden region-list';
    $johtoOl.className = 'hidden region-list';
    $listContainer.className = 'list-container';
    $searchContainer.className = 'hidden search-container';
    $caughtOl.className = 'hidden region-list';
    pokemonObject.pokemon_name = selectedPokemon.id;
    divPokemonPage = createPokemonPage(pokemonObject);
    pokemonTypeImageId(selectedPokemon.id);
    var $pokemonPage = document.querySelector('.pokemon-page');
    if ($pokemonPage === null) {
      $listContainer.appendChild(divPokemonPage);
    } else {
      $pokemonPage.replaceWith(divPokemonPage);
    }
  }
}

function pokemonTypeImageId(id) {
  loadingGif();
  var xhrTypeImageId = new XMLHttpRequest();
  xhrTypeImageId.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhrTypeImageId.responseType = 'json';
  xhrTypeImageId.addEventListener('load', function () {
    pokemonObject.image = xhrTypeImageId.response.sprites.other['official-artwork'].front_default;
    pokemonObject.number = xhrTypeImageId.response.id;
    for (var typeIndexAPI = 0; typeIndexAPI < xhrTypeImageId.response.types.length; typeIndexAPI++) {
      pokemonObject.types.push(xhrTypeImageId.response.types[typeIndexAPI].type.name);
    }

    var divColumnLeft = document.createElement('div');
    divColumnLeft.setAttribute('class', 'column-left');
    divPokemonPage.appendChild(divColumnLeft);

    var errorImageUrl = 'https://cdn.systweak.com/content/wp/systweakblogsnew/uploads_new/2018/03/How-to-Fix-Aw-Snap-Error-in-Chrome1.jpg';

    var imgPokemon = document.createElement('img');
    imgPokemon.setAttribute('class', 'pokemon-img');
    imgPokemon.setAttribute('src', pokemonObject.image);
    imgPokemon.setAttribute('alt', capitalize(pokemonObject.pokemon_name) + ' Image');
    imgPokemon.addEventListener('load', event => {
      divColumnLeft.prepend(imgPokemon);
    });
    imgPokemon.addEventListener('error', event => {
      imgPokemon.setAttribute('src', errorImageUrl);
    });

    var divPokemonNTContainer = document.createElement('div');
    divPokemonNTContainer.setAttribute('class', 'pokemon-nt-container');
    divColumnLeft.appendChild(divPokemonNTContainer);

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
  xhrTypeImageId.addEventListener('error', error => {
    console.error(error);
    const errorMessagePage = document.createElement('p');
    errorMessagePage.setAttribute('class', 'error-message-page');
    const errorTextPage = document.createTextNode('Connection Error with API');
    errorMessagePage.appendChild(errorTextPage);
    divPokemonPage.appendChild(errorMessagePage);
    loadingGif();
  });
  xhrTypeImageId.send();
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

    var divColumnRight = document.createElement('div');
    divColumnRight.setAttribute('class', 'column-right');
    divPokemonPage.appendChild(divColumnRight);

    var pPokemonFT = document.createElement('p');
    pPokemonFT.setAttribute('class', 'pokemon-flavor-text');
    var tnPokemonFT = document.createTextNode(pokemonObject.flavorText);
    pPokemonFT.appendChild(tnPokemonFT);
    divColumnRight.appendChild(pPokemonFT);

    var divCatch = document.createElement('div');
    divCatch.setAttribute('class', 'catch-container');

    var pCatch = document.createElement('p');
    pCatch.setAttribute('class', 'button-catch-text');
    var catchText = document.createTextNode('');
    pCatch.appendChild(catchText);

    var buttonCatch = document.createElement('img');
    if (data.caughtList.length === 0) {
      buttonCatch.setAttribute('class', 'catch not-caught');
      buttonCatch.setAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/f/f5/Pok%C3%A9_Ball_PE.png/1204px-Pok%C3%A9_Ball_PE.png');
      pCatch.textContent = 'Catch';
    } else {
      for (var z = 0; z < data.caughtList.length; z++) {
        if (data.caughtList[z].pokemon_name === id) {
          buttonCatch.setAttribute('class', 'catch caught');
          buttonCatch.setAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/a/a2/Cherish_Ball_PE.png/1146px-Cherish_Ball_PE.png');
          pCatch.textContent = 'Release';
          break;
        } else {
          buttonCatch.setAttribute('class', 'catch not-caught');
          buttonCatch.setAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/f/f5/Pok%C3%A9_Ball_PE.png/1204px-Pok%C3%A9_Ball_PE.png');
          pCatch.textContent = 'Catch';
        }
      }
    }
    divCatch.appendChild(buttonCatch);
    divCatch.appendChild(pCatch);
    divColumnRight.appendChild(divCatch);

    buttonCatch.addEventListener('click', catchPokemon);

    function catchPokemon(event) {
      if (buttonCatch.className === 'catch not-caught') {
        pCatch.textContent = 'Release';
        buttonCatch.className = 'catch caught';
        buttonCatch.setAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/a/a2/Cherish_Ball_PE.png/1146px-Cherish_Ball_PE.png');

        data.caughtList.push(pokemonObject);
      } else {
        pCatch.textContent = 'Catch';
        buttonCatch.className = 'catch not-caught';
        buttonCatch.setAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/f/f5/Pok%C3%A9_Ball_PE.png/1204px-Pok%C3%A9_Ball_PE.png');
        for (var a = 0; a < data.caughtList.length; a++) {
          if (data.caughtList[a].pokemon_name === id) {
            data.caughtList.splice(a, 1);
            break;
          }
        }
      }
      data.caughtList.sort(function (a, b) {
        return a.number - b.number;
      });
    }
    loadingGif();
  });
  xhrFlavorText.send();
}

function createPokemonPage(pokemonObject) {
  var divPokemonEntry = document.createElement('div');
  divPokemonEntry.setAttribute('class', 'pokemon-page');
  return divPokemonEntry;
}

function caughtDex(data) {
  while ($caughtOl.firstChild) {
    $caughtOl.removeChild($caughtOl.lastChild);
  }
  if (data.caughtList.length === 0) {
    const gottaCatchEmAll = document.createElement('p');
    gottaCatchEmAll.setAttribute('class', 'gotta-catch-em-all');
    const gottaCatchEmAllText = document.createTextNode("Gotta Catch 'Em All!");
    gottaCatchEmAll.appendChild(gottaCatchEmAllText);
    $caughtOl.appendChild(gottaCatchEmAll);
  } else {
    for (let caughtIndex = 0; caughtIndex < data.caughtList.length; caughtIndex++) {
      const caughtPokemonName = capitalize(data.caughtList[caughtIndex].pokemon_name);
      const caughtPokemonLi = createListItem(caughtPokemonName);
      caughtPokemonLi.setAttribute('value', data.caughtList[caughtIndex].number);
      const divCaughtImg = document.createElement('div');
      divCaughtImg.setAttribute('class', 'caught-img-container');
      caughtPokemonLi.appendChild(divCaughtImg);
      const errorImageUrl = 'https://cdn.systweak.com/content/wp/systweakblogsnew/uploads_new/2018/03/How-to-Fix-Aw-Snap-Error-in-Chrome1.jpg';
      const caughtPokemonImage = document.createElement('img');
      caughtPokemonImage.setAttribute('class', 'caught-pokemon-img');
      caughtPokemonImage.setAttribute('src', data.caughtList[caughtIndex].image);
      caughtPokemonImage.setAttribute('alt', capitalize(data.caughtList[caughtIndex].pokemon_name) + ' Image');
      caughtPokemonImage.addEventListener('load', event => {
        divCaughtImg.appendChild(caughtPokemonImage);
      });
      caughtPokemonImage.addEventListener('error', event => {
        caughtPokemonImage.setAttribute('src', errorImageUrl);
      });
      $caughtOl.appendChild(caughtPokemonLi);
    }
  }
}

function createSearchList() {
  var ulSearchList = document.createElement('ul');
  ulSearchList.setAttribute('class', 'search-list');
  $searchListContainer.appendChild(ulSearchList);
  return ulSearchList;
}

var $searchBar = document.getElementById('nationaldex');
var $searchForm = document.querySelector('.search-form');
$searchForm.addEventListener('submit', event => {
  event.preventDefault();
});
$searchBar.addEventListener('input', function (event) {
  ulSearch = createSearchList();
  for (var g = 0; g < nationalList.length; g++) {
    var lowerSearch = nationalList[g].toLowerCase();
    if (lowerSearch.includes($searchBar.value.toLowerCase())) {
      var searchLi = createListItem(nationalList[g]);
      ulSearch.appendChild(searchLi);
    }
  }
  var $ul = document.querySelector('ul');
  if ($ul === null) {
    $searchListContainer.appendChild(ulSearch);
  } else {
    $ul.replaceWith(ulSearch);
  }
  var $searchList = document.querySelector('.search-list');
  $searchList.addEventListener('click', pokemonPage);
});

function loadingGif() {
  if ($loading.className === 'hidden loading') {
    $loading.className = 'loading';
  } else {
    $loading.className = 'hidden loading';
  }
}
