let deactivatedModal = false;

// Animates loading more Pokemon Button
function toggleLoadingButtonAnimation() {
    let defaultBall = document.getElementById('loading-btn-wrapper');
    let loadingBall = document.getElementById('loading-anime-wrapper')

    loadingBall.classList.toggle('layer1');
    setTimeout(startButtonAnimation, 200, loadingBall, defaultBall); // Waits .2s for the fadeback transition. Just change in conjunction with the .fadeout class in animation.css
}


function startButtonAnimation(loadingBall, defaultBall) {
    loadingBall.classList.toggle('loading-anime');
    defaultBall.classList.toggle('o-none');
}


// Animates toggle Modal
function openModal(i) {
    if (deactivatedModal) return;
    deactivatedModal = true;

    let data = loadedPokemonGerman;
    let pokemonName = data[i]['name'];
    let pokemonID = data[i]['id'].toString().padStart(3, "0");
    let pokemonImage = data[i]['image']; // URL of Image of Pokemon
    let pokemonColor = data[i]['color']; // Color of Pokemon used as BG-CSS-Class
    let nextPokemon = data[i + 1]['animation'];

    document.getElementById('pokedexName').innerHTML = pokemonName;
    document.getElementById('pokedexId').innerHTML = '#' + pokemonID;
    document.getElementById('pokedexSprite').src = pokemonImage;
    document.getElementById('nextPokemon').src = nextPokemon;
    document.getElementById('pokedex').classList.add(pokemonColor);

    for (let j = 0; j < loadedPokemonGerman[i].types.length; j++) {
        let englishType = loadedPokemonGerman[i].types[j];
        let germanType = germanTypes[englishType];

        document.getElementById(`pokedexTypes`).innerHTML += `
         <div class="${englishType} type">
             ${germanType}
         </div>
     `;
    }

    document.getElementById('card-modal').classList.add('modal-animation');
    document.getElementById('header').classList.add('blur');
    document.getElementById('listOfPokemon').classList.add('blur');
    document.getElementById('load-button').classList.add('blur');
}


function closeModal() {
    document.getElementById('header').classList.remove('blur');
    document.getElementById('listOfPokemon').classList.remove('blur');
    document.getElementById('load-button').classList.remove('blur');
    document.getElementById('card-modal').classList.remove('modal-animation');

    setTimeout(() => {
        clearModalInfos()
    }, 600);
}


function clearModalInfos() {
    document.getElementById(`pokedexTypes`).innerHTML = '';
    document.getElementById('pokedex').classList = '';
    deactivatedModal = false;
}