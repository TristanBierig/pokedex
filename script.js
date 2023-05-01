let currentPokemon;


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/2';
    let responsePokemon = await fetch(url);
    currentPokemon = await responsePokemon.json();

    let urlAbilites = 'https://pokeapi.co/api/v2/ability/1';
    let responseAbilites = await fetch(urlAbilites);
    currentAbilities = await responseAbilites.json();

    let responseSpecies = await fetch(currentPokemon.species.url);
    currentSpecies = await responseSpecies.json();

    console.log('Loaded pokemon', currentPokemon, currentSpecies, currentAbilities);
    renderPokemonInfo();
}


function renderPokemonInfo() {
    document.getElementById('pokemonName').innerHTML = currentSpecies.names[5].name;
    document.getElementById('pokemonSprite').src = currentPokemon.sprites.other["official-artwork"].front_default;

    document.getElementById('pokedexOverview').style.backgroundColor = currentSpecies.color.name;
    document.getElementById('pokedexStats').style.boxShadow = `0 -24px 0 0 ${currentSpecies.color.name}`;
}
