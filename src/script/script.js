let currentPokemon;
let pokemonNumber = 1;
let pokemonRequests = [];
let pokemonData = [];
let pokemonResponse = [];


function init() {
    loadPokemon();
}


async function loadPokemon() {
    await loadPokemonSprite();
    await loadPokemonOverview();

    renderListOfPokemon();
}


async function loadPokemonSprite() {
    for (let i = 1; i <= 50; i++) {
        let url = 'https://pokeapi.co/api/v2/pokemon/' + i;
        pokemonRequests.push(fetch(url));
        createNewJsonObject();
    }
    pokemonResponse = await Promise.all(pokemonRequests);
    pokemonData = await Promise.all(pokemonResponse.map(response => response.json()));

    for (let j = 0; j < pokemonData.length; j++) {
        let data = loadedPokemonGerman[j];
        data['image'] = pokemonData[j].sprites.other["official-artwork"].front_default;

        for (let k = 0; k < pokemonData[j].types.length; k++) {
            data['types'].push(pokemonData[j].types[k].type.name);
        }

    }

    pokemonRequests = [];
    pokemonResponse = [];
    pokemonData = [];
}


async function loadPokemonOverview() {
    for (let i = 1; i <= 50; i++) {
        let url2 = 'https://pokeapi.co/api/v2/pokemon-species/' + i;
        pokemonRequests.push(fetch(url2));
    }
    pokemonResponse = await Promise.all(pokemonRequests);
    pokemonData = await Promise.all(pokemonResponse.map(response => response.json()));

    for (let j = 0; j < pokemonData.length; j++) {
        let data = loadedPokemonGerman[j];

        data['id'] = pokemonData[j].id;
        data['name'] = pokemonData[j].names.find((name) => name.language.name === 'de')?.name;
        data['color'] = pokemonData[j].color.name;
        data['flavor'] = pokemonData[j].flavor_text_entries.find((flavor) => flavor.language.name === 'de')?.flavor_text;
    }
}


function createNewJsonObject() {
    loadedPokemonGerman.push({
        'id': '',
        'name': '',
        'color': '',
        'image': '',
        'flavor': '',
        'types': []
    },);
}


function renderListOfPokemon() {
    let listContainer = document.getElementById('listOfPokemon');
    let data = loadedPokemonGerman;
    // listContainer.innerHTML = '';

    for (let i = 0; i < data.length; i++) {

        let pokemonName = data[i]['name'];
        let pokemonFlavor = data[i]['flavor'];
        let pokemonID = data[i]['id'].toString().padStart(3, "0");
        let pokemonImage = data[i]['image']; // URL of Image of Pokemon
        let pokemonColor = data[i]['color']; // Color of Pokemon used as BG

        listContainer.innerHTML += singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor);
        pokemonTypeLabels(i);
        pokemonNumber = pokemonNumber + 1;
    }

    for (let j = 0; j < data.length; j++) {
        document.getElementById(`pokemon${j}`).classList.remove('d-none');
    }
}


function pokemonTypeLabels(j) {
    for (let i = 0; i < loadedPokemonGerman[j].types.length; i++) {
        let type = loadedPokemonGerman[j].types[i];
        document.getElementById(`pokemonTypes${j}`).innerHTML += `
        <div class="${type} type">
            ${type}
        </div>
    `;
    }
}


function singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor) {
    return `
    <div class="d-none pokemon-cards ${pokemonColor}" id="pokemon${i}">
    
        <div class="pokeball-bg">
            <img class="pokemon-sprite" src="${pokemonImage}" alt="" loading="lazy">

            <div class="card-header">
                <span class="pokemon-name" id="">${pokemonName}</span>
                <span class="pokemon-id" id="pokemonId">#${pokemonID}</span>
            </div>
            
            <div class="card-line"></div>
        </div>

        <div class="pokemon-flavor">
                "${pokemonFlavor}"
        </div>

        <div class="pokemon-types" id="pokemonTypes${i}">
        </div>
    </div>
    `;
}