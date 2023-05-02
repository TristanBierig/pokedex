let currentPokemon;
let pokemonNumber = 10;

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
}


function renderPokemonInfo() {
    document.getElementById('pokemonName').innerHTML = currentSpecies.names[5].name;
    document.getElementById('pokemonId').innerHTML += pokemonNumber.toString().padStart(3, "0");
    document.getElementById('pokemonSprite').src = currentPokemon.sprites.other["official-artwork"].front_default;
    document.getElementById('pokedexOverview').style.backgroundColor = currentSpecies.color.name;
    document.getElementById('pokedexStats').style.boxShadow = `0 -24px 0 0 ${currentSpecies.color.name}`;
    
    for (let i = 0; i < currentPokemon.types.length; i++) {
        let type = currentPokemon.types[i].type.name;
        document.getElementById('pokemonTypes').innerHTML +=`
        <div class="${type} type">
            ${type}
        </div>
    `;
    }
    
}
