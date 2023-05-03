let currentPokemon;
let pokemonNumber = 100;

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
    renderPokemonInfo();
    renderListOfPokemon();
}


function renderPokemonInfo() {
    document.getElementById('pokedexName').innerHTML = currentSpecies.names[5].name; // Name of Pokemon
    document.getElementById('pokedexId').innerHTML += pokemonNumber.toString().padStart(3, "0"); // ID of Pokemon
    document.getElementById('pokedexSprite').src = currentPokemon.sprites.other["official-artwork"].front_default; // Image of Pokemon
    document.getElementById('pokedexOverview').style.backgroundColor = currentSpecies.color.name; // Color of Pokemon used as BG
    document.getElementById('pokedexStats').style.boxShadow = `0 -24px 0 0 ${currentSpecies.color.name}`; // Color of Pokemon used for Styling of Pokedex Card
    
    for (let i = 0; i < currentPokemon.types.length; i++) {
        let type = currentPokemon.types[i].type.name;
        document.getElementById('pokedexTypes').innerHTML +=`
        <div class="${type} type">
            ${type}
        </div>
    `;
    }
}


function renderListOfPokemon() {
    let listContainer = document.getElementById('listOfPokemon');
    let pokemonName = currentSpecies.names[5].name; // Name of Pokemon
    let pokemonID = pokemonNumber.toString().padStart(3, "0"); // ID of Pokemon
    let pokemonImage = currentPokemon.sprites.other["official-artwork"].front_default; // URL of Image of Pokemon
    let pokemonColor = currentSpecies.color.name; // Color of Pokemon used as BG

    listContainer.innerHTML = '';

 for (let i = 1; i < 10; i++) {
    listContainer.innerHTML += singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor);
 }
}


function singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor) {
    return `
    <div class="pokemon-cards ${pokemonColor}" id="pokemon${i}">
        <div id="">
            <span class="pokemonName" id="">${pokemonName}</span>
            <span class="pokemonId" id="pokemonId">#${pokemonID}</span>
            <div class="pokemonTypes" id="pokemonTypes"></div>
        </div>

        <img class="pokeball-bg" src="/src/img/pokeball-bg.png" alt="">
        <img id="pokemonSprite" src="${pokemonImage}" alt="">
    </div>
    `;
}