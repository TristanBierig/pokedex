let pokemonLoaded = 0;
let pokemonRendered = 0;
let pokemonLoadedMax = 30; // Defines number of pokemon getting loaded in one run. If change, then LOC 86, 87 numbers have to be changed accordingly
let contentLoaded = true;

let pokemonRequests1 = [];
let pokemonRequests2 = [];
let pokemonData1 = [];
let pokemonData2 = [];
let pokemonResponse1 = [];
let pokemonResponse2 = [];


async function init() {
    await loadAllPokemonData();
    createGermanJson();
    renderListOfPokemon();
    resetFetchedCachedData();
}


async function loadAllPokemonData() {
    // Gets all the data needed from API
    for (let i = pokemonLoaded + 1; i <= pokemonLoadedMax; i++) {
        const url1 = 'https://pokeapi.co/api/v2/pokemon/' + i;
        const url2 = 'https://pokeapi.co/api/v2/pokemon-species/' + i;
        pokemonRequests1.push(fetch(url1));
        pokemonRequests2.push(fetch(url2));
    }

    pokemonResponse1 = await Promise.all(pokemonRequests1);
    pokemonResponse2 = await Promise.all(pokemonRequests2);
    pokemonData1 = await Promise.all(pokemonResponse1.map(response => response.json()));
    pokemonData2 = await Promise.all(pokemonResponse2.map(response => response.json()));
}


function createGermanJson() {
    for (let i = 0; i < pokemonData1.length; i++) {

        let id = pokemonData1[i].id;
        let name = pokemonData2[i].names.find((name) => name.language.name === 'de')?.name;
        let color = pokemonData2[i].color.name;
        let image = pokemonData1[i].sprites.other["official-artwork"].front_default;
        let flavor = pokemonData2[i].flavor_text_entries.find((flavor) => flavor.language.name === 'de')?.flavor_text;

        if (flavor == undefined) {
            flavor = "Für dieses Pokémon ist noch keine Beschreibung verfügbar!";
        }

        loadedPokemonGerman.push({
            'id': id,
            'name': name,
            'color': color,
            'image': image,
            'flavor': flavor,
            'types': []
        });

        for (let j = 0; j < pokemonData1[i].types.length; j++) {
            loadedPokemonGerman[pokemonLoaded]['types'].push(pokemonData1[i].types[j].type.name);
        }
        pokemonLoaded = pokemonLoaded + 1;
    }
}


function renderListOfPokemon() {
    let listContainer = document.getElementById('listOfPokemon');
    let data = loadedPokemonGerman;

    for (let i = pokemonRendered; i < pokemonLoadedMax; i++) {
        let pokemonName = data[i]['name'];
        let pokemonFlavor = data[i]['flavor'];
        let pokemonID = data[i]['id'].toString().padStart(3, "0");
        let pokemonImage = data[i]['image']; // URL of Image of Pokemon
        let pokemonColor = data[i]['color']; // Color of Pokemon used as BG

        listContainer.innerHTML += singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor);
        pokemonTypeLabels(i);
    }

    for (let j = 0; j < data.length; j++) {
        document.getElementById(`pokemon${j}`).classList.remove('d-none');
    }
    pokemonRendered = pokemonRendered + 30; // Sets new starting point for next Loading Loop
    pokemonLoadedMax = pokemonLoadedMax + 30; // Sets new starting point for next Loading Loop
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


function resetFetchedCachedData() {
    pokemonRequests1 = [];
    pokemonRequests2 = [];
    pokemonData1 = [];
    pokemonData2 = [];
    pokemonResponse1 = [];
    pokemonResponse2 = [];
}


async function loadMorePokemon() {
    await loadAllPokemonData();
    createGermanJson();
    renderListOfPokemon();
    resetFetchedCachedData();
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