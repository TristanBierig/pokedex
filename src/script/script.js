let pokemonLoaded = 0;
let pokemonRendered = 0;
let pokemonLoadedMax = 30; // Defines number of pokemon getting loaded in one run. If change, then LOC 123, 124 numbers have to be changed accordingly
let contentLoading = false;
let modalAnimationRunning = false;
let statsNameData = [];
let statsNameDataLoaded = false;

// Needed to cache Data for creating production JSON
/* ========== */
let pokemonRequests1 = [];
let pokemonRequests2 = [];
let pokemonRequestsAbility = [];
let pokemonRequestsStats = [];

let pokemonResponse1 = [];
let pokemonResponse2 = [];
let pokemonResponseAbility = [];
let pokemonResponseStats = [];

let pokemonData1 = [];
let pokemonData2 = [];
let pokemonDataAbility = [];
let pokemonDataStats = [];
/* ========== */


async function init() {
    await fetchAllPokemonData();
    await processGermanStatNameData();
    await createGermanJson();
    renderListOfPokemon();
    resetFetchedCachedData();
}


async function loadMorePokemon() {
    toggleLoadingButtonAnimation();

    await fetchAllPokemonData();
    await processGermanStatNameData();
    await createGermanJson();
    renderListOfPokemon();
    resetFetchedCachedData();

    toggleLoadingButtonAnimation();
}


async function fetchAllPokemonData() {
    // Gets baseline data needed from API
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


async function createGermanJson() {
    for (let i = 0; i < pokemonData1.length; i++) {

        let id = pokemonData1[i].id;
        let name = pokemonData2[i].names.find((name) => name.language.name === 'de')?.name;
        let color = pokemonData2[i].color.name;
        let image = pokemonData1[i].sprites.other["official-artwork"].front_default;
        let flavor = pokemonData2[i].flavor_text_entries.find((flavor) => flavor.language.name === 'de')?.flavor_text;
        let height = pokemonData1[i].height;
        let weight = pokemonData1[i].weight;
        let genera = pokemonData2[i].genera.find((name) => name.language.name === 'de')?.genus;

        if (flavor == undefined) {
            flavor = "Für dieses Pokémon ist noch keine Beschreibung verfügbar!";
        }

        loadedPokemonGerman.push({
            'id': id,
            'name': name,
            'color': color,
            'image': image,
            'flavor': flavor,
            'stats': {
                'key': statsNameData,
                'value': []
            },
            'height': height,
            'weight': weight,
            'genera': genera,
            'abilities': [],
            'types': []
        });

        for (let j = 0; j < pokemonData1[i].types.length; j++) {
            loadedPokemonGerman[pokemonLoaded]['types'].push(pokemonData1[i].types[j].type.name);
        }

        processGermanStatValueData(i);
        await processGermanAbilityData(i);
        pokemonLoaded = pokemonLoaded + 1; // Sets number for self generated production JSON-Count
    }
}


async function processGermanAbilityData(i) {
    let abilities = pokemonData1[i].abilities;

    // Fetch Data
    for (let j = 0; j < abilities.length; j++) {
        let abilityURL = abilities[j].ability.url;
        pokemonRequestsAbility.push(fetch(abilityURL));
    }

    pokemonResponseAbility = await Promise.all(pokemonRequestsAbility);
    pokemonDataAbility = await Promise.all(pokemonResponseAbility.map(response => response.json()));

    // Searches for german Term and pushing it to production JSON
    for (let k = 0; k < pokemonDataAbility.length; k++) {
        let ability = pokemonDataAbility[k].names.find((name) => name.language.name === 'de')?.name;
        loadedPokemonGerman[pokemonLoaded]['abilities'].push(ability);
    }

    // Resets Cache
    pokemonRequestsAbility = [];
    pokemonResponseAbility = [];
    pokemonDataAbility = [];
}


async function processGermanStatNameData() {

    // Fetch Data once
    if (!statsNameDataLoaded) {
        for (let i = 0; i < pokemonData1[0].stats.length; i++) {
            let statNameURL = pokemonData1[0].stats[i].stat.url;
            pokemonRequestsStats.push(fetch(statNameURL));
        }
        pokemonResponseStats = await Promise.all(pokemonRequestsStats);
        pokemonDataStats = await Promise.all(pokemonResponseStats.map(response => response.json()));

        // Searches for german Term and pushing it to Array
        for (let k = 0; k < pokemonDataStats.length; k++) {
            let statName = pokemonDataStats[k].names.find((name) => name.language.name === 'de')?.name;
            statsNameData.push(statName);
        }
        statsNameDataLoaded = true;
    }
}


function processGermanStatValueData(i) {
    for (let l = 0; l < pokemonDataStats.length; l++) {
        let statValue = pokemonData1[i].stats[l].base_stat;
        loadedPokemonGerman[pokemonLoaded]['stats'].value.push(statValue);
    }
}


function renderListOfPokemon() {
    let listContainer = document.getElementById('listOfPokemon');
    let data = loadedPokemonGerman;

    for (let i = pokemonRendered; i < pokemonLoadedMax; i++) {
        let pokemonName = data[i]['name'];
        let pokemonFlavor = data[i]['flavor']; // Description of pokemon
        let pokemonID = data[i]['id'].toString().padStart(3, "0");
        let pokemonImage = data[i]['image']; // URL of Image of Pokemon
        let pokemonColor = data[i]['color']; // Color of Pokemon used as BG-CSS-Class

        listContainer.innerHTML += singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor);
        pokemonTypeLabels(i);
    }

    for (let j = 0; j < data.length; j++) {
        document.getElementById(`pokemon${j}`).classList.remove('d-none'); // Makes all new loaded Cards reveal simultaneously
    }

    pokemonRendered = pokemonRendered + 30; // Sets new starting point for next Loading Loop
    pokemonLoadedMax = pokemonLoadedMax + 30; // Sets new starting point for next Loading Loop
}


function pokemonTypeLabels(j) {
    for (let i = 0; i < loadedPokemonGerman[j].types.length; i++) {
        let englishType = loadedPokemonGerman[j].types[i];
        let germanType = germanTypes[englishType];

        document.getElementById(`pokemonTypes${j}`).innerHTML += `
        <div class="${englishType} type">
            ${germanType}
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





function doNotClose(event) {
    event.stopPropagation();
}



function singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor) {
    return `
    <div class="d-none pokemon-cards" id="pokemon${i}" onclick="openModal(${i})">
        <div id="card-bg" class="${pokemonColor}"></div>
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