async function fetchAllPokemonData() {
    // Fetch all basic data from bunch of pokemon
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
        let animated = pokemonData1[i].sprites.versions["generation-v"]["black-white"].animated.front_default;

        if (flavor == undefined) {
            flavor = "Für dieses Pokémon ist noch keine Beschreibung verfügbar!";
        }

        loadedPokemonGerman.push({
            'id': id,
            'name': name,
            'color': color,
            'image': image,
            'animation': animated,
            'flavor': flavor,
            'stats': {
                'key': statsNameData,
                'value': []
            },
            'height': height,
            'weight': weight,
            'genera': genera,
            'abilities': {
                'ability-Name': [],
                'ability-Url': []
            },
            'types': [],
            'evo-ID': await getEvolutionId(i),
            'evo-Images': []
        });

        for (let j = 0; j < pokemonData1[i].types.length; j++) {
            loadedPokemonGerman[pokemonLoaded]['types'].push(pokemonData1[i].types[j].type.name);
        }

        for (let k = 0; k < pokemonData1[i].abilities.length; k++) {
            const element = pokemonData1[i].abilities[k];
            loadedPokemonGerman[pokemonLoaded]['abilities']['ability-Url'].push(element.ability.url);
        }

        processGermanStatValueData(i);
        pokemonLoaded = pokemonLoaded + 1; // Sets number for self generated production JSON-Count
    }
}


async function processEvolutionData(i) {
    if (loadedPokemonGerman[i]['evo-Images'].length > 0) {
        return;
    }
    await fetchEvolutionData(i);
    let id = +evo.chain.species.url.substring(42).slice(0, -1); // Gets ID of base pokemon
    let url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/';

    loadedPokemonGerman[i]['evo-Images'].push(url + id + '.gif');
    checkForFirstEvolution(url, i);
}


async function fetchEvolutionData(i) {
    evoResponse = await fetch('https://pokeapi.co/api/v2/evolution-chain/' + loadedPokemonGerman[i]['evo-ID']);
    evo = await evoResponse.json();
}


function checkForFirstEvolution(url, i) {
    if (evo.chain.evolves_to.length != 0) {
        let id = +evo.chain.evolves_to[0].species.url.substring(42).slice(0, -1); // Gets ID of first evolution
        loadedPokemonGerman[i]['evo-Images'].push(url + id + '.gif');
    } else {
        return; // Prevents Error if Pokemon has no Evolution at all
    }
    checkForSecondEvolution(url, i);
}


function checkForSecondEvolution(url, i) {
    if (evo.chain.evolves_to[0].evolves_to.length != 0) {
        let id = +evo.chain.evolves_to[0].evolves_to[0].species.url.substring(42).slice(0, -1); // Gets ID of second evolution if available
        loadedPokemonGerman[i]['evo-Images'].push(url + id + '.gif');
    }
}


async function getEvolutionId(i) {
    let evoURL = pokemonData2[i].evolution_chain.url;

    evoResponse = await fetch(evoURL);
    evoData = await evoResponse.json();
    return evoData.id;
}


async function processGermanAbilityData(i) {
    if (contentLoading) {
        return
    }
    contentLoading = true;
    await fetchGermanAbilityData(i);
    findGermanAbilityTerm(i);
    resetAbilityCache();
    contentLoading = false;
}


async function fetchGermanAbilityData(i) {
    let abilities = loadedPokemonGerman[i].abilities;

    if (abilities['ability-Name'].length > 0) {
        return;
    }
    // Fetch Data
    for (let j = 0; j < abilities['ability-Url'].length; j++) {
        pokemonRequestsAbility.push(fetch(abilities['ability-Url'][j]));
    }

    pokemonResponseAbility = await Promise.all(pokemonRequestsAbility);
    pokemonDataAbility = await Promise.all(pokemonResponseAbility.map(response => response.json()));
}


function findGermanAbilityTerm(i) {
    // Searches for german Term and pushing it to production JSON
    for (let k = 0; k < pokemonDataAbility.length; k++) {
        let ability = pokemonDataAbility[k].names.find((name) => name.language.name === 'de')?.name;
        loadedPokemonGerman[i].abilities['ability-Name'].push(ability);
    }
}


function resetAbilityCache() {
    pokemonRequestsAbility = [];
    pokemonResponseAbility = [];
    pokemonDataAbility = [];
}


async function processGermanStatNameData() {
    // Fetch Data once from first Pokemon only and use for all of them
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


async function searchPokemon() {
    let nameInput = document.getElementById('search-input').value;
    nameInput = nameInput.trim().toLowerCase();

    if (!nameInput.match(/^[a-zA-Z]+$/)) { // Returns if input is anything but letters
        return;
    }

    document.getElementById('listOfPokemon').innerHTML = '';
    for (let i = 0; i < loadedPokemonGerman.length; i++) {
        let name = loadedPokemonGerman[i].name;
        if (name.toLowerCase().includes(nameInput)) {
            generateSingleCard(i);
            document.getElementById(`pokemon${i}`).classList.remove('d-none');
        }
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