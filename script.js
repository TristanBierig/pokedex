let currentPokemon;
let pokemonNumber = 1;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/' + pokemonNumber;
    let responsePokemon = await fetch(url);
    currentPokemon = await responsePokemon.json();

    // let urlAbilites = 'https://pokeapi.co/api/v2/ability/' + pokemonNumber;
    // let responseAbilites = await fetch(urlAbilites);
    // currentAbilities = await responseAbilites.json();

    let responseSpecies = await fetch(currentPokemon.species.url);
    currentSpecies = await responseSpecies.json();

    console.log('Loaded pokemon', currentPokemon, currentSpecies, /*currentAbilities*/);
    renderListOfPokemon();
}


function renderPokemonInfo() {
    document.getElementById('pokedexName').innerHTML = currentSpecies.names[5].name; // Name of Pokemon
    document.getElementById('pokedexId').innerHTML += pokemonNumber.toString().padStart(3, "0"); // ID of Pokemon
    document.getElementById('pokedexSprite').src = currentPokemon.sprites.other["official-artwork"].front_default; // Image of Pokemon
    document.getElementById('pokedexOverview').style.backgroundColor = currentSpecies.color.name; // Color of Pokemon used as BG
    document.getElementById('pokedexStats').style.boxShadow = `0 -24px 0 0 ${currentSpecies.color.name}`; // Color of Pokemon used for Styling of Pokedex Card
}


async function renderListOfPokemon() {
    let listContainer = document.getElementById('listOfPokemon');

    // listContainer.innerHTML = '';

    for (let i = 1; i < 20; i++) {
        let pokemonName = currentSpecies.names.find((name) => name.language.name === 'de')?.name; // Searches for german Name
        let pokemonFlavor = currentSpecies.flavor_text_entries.find((flavor) => flavor.language.name === 'de')?.flavor_text;
        let pokemonID = pokemonNumber.toString().padStart(3, "0"); // ID of Pokemon
        let pokemonImage = currentPokemon.sprites.other["official-artwork"].front_default; // URL of Image of Pokemon
        let pokemonColor = currentSpecies.color.name; // Color of Pokemon used as BG

        listContainer.innerHTML += singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor);
        pokemonTypeLabels(i);
        pokemonNumber = pokemonNumber + 1;

        let url = 'https://pokeapi.co/api/v2/pokemon/' + pokemonNumber;
        let responsePokemon = await fetch(url);
        currentPokemon = await responsePokemon.json();

        let responseSpecies = await fetch(currentPokemon.species.url);
        currentSpecies = await responseSpecies.json();
    }
}


function pokemonTypeLabels(j) {
    for (let i = 0; i < currentPokemon.types.length; i++) {
        let type = currentPokemon.types[i].type.name;
        document.getElementById(`pokemonTypes${j}`).innerHTML += `
        <div class="${type} type">
            ${type}
        </div>
    `;
    }
}


function singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor) {
    return `
    <div class="pokemon-cards ${pokemonColor}" id="pokemon${i}">
    
        <div class="pokeball-bg">
            <img class="pokemon-sprite" src="${pokemonImage}" alt="">

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