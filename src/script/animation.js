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
async function openModal(i) {
    if (deactivatedModal) return;
    deactivatedModal = true;

    if (i == pokemonLoaded - 1) {
        await loadMorePokemon();
    }

    // Generates different HTML template wether or not its the first pokemon targeted
    if (i > 0) {
        let prevPokemon = loadedPokemonGerman[i - 1]['image'];
        document.getElementById('card-modal').innerHTML = generateModalBasicHTML(i);
        document.getElementById('prevPokemon').src = prevPokemon;
    } else {
        document.getElementById('card-modal').innerHTML = generateFirstModalBasicHTML(i);
    }

    let pokemonName = loadedPokemonGerman[i]['name'];
    let pokemonID = loadedPokemonGerman[i]['id'].toString().padStart(3, "0");
    let pokemonImage = loadedPokemonGerman[i]['image']; // URL of Image of Pokemon
    let pokemonColor = loadedPokemonGerman[i]['color']; // Color of Pokemon used as BG-CSS-Class
    let nextPokemon = loadedPokemonGerman[i + 1]['image'];

    generateModalNavHTML(i);
    renderAbout(i);

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


function renderAbout(i) {
    generateModalLowerAboutHTML();

    let bgColor = loadedPokemonGerman[i]['color'];
    let aboutSpecies = loadedPokemonGerman[i]['genera'];
    let aboutHeight = loadedPokemonGerman[i]['height'] * 0.1; // Calc from dezimeter to meter
    let aboutWeight = loadedPokemonGerman[i]['weight'] * 0.1; // Calc from hectogram to kilogram
    let aboutAbilities = loadedPokemonGerman[i]['abilities'];

    aboutHeight = aboutHeight.toLocaleString('de-DE', {
        maximumFractionDigits: 2
    }) + ' m';

    aboutWeight = aboutWeight.toLocaleString('de-DE', {
        maximumFractionDigits: 2
    }) + ' kg';


    document.getElementById('about-species').innerHTML = aboutSpecies;
    document.getElementById('about-height').innerHTML = aboutHeight;
    document.getElementById('about-weight').innerHTML = aboutWeight;
    document.getElementById('about-abilities').innerHTML = aboutAbilities.join(', ');

    document.getElementById('statsNavAbout').classList.add(bgColor);
    document.getElementById('statsNavStats').classList.remove(bgColor);
    document.getElementById('statsNavEvolution').classList.remove(bgColor);
}


function renderStats(i) {
    generateModalLowerStatsHTML();

    let bgColor = loadedPokemonGerman[i]['color'];
    const ctx = document.getElementById('myChart');
    const label = loadedPokemonGerman[i].stats.key;
    const value = loadedPokemonGerman[i].stats.value;

    createNewChart(ctx, label, value);

    document.getElementById('statsNavStats').classList.add(bgColor);
    document.getElementById('statsNavAbout').classList.remove(bgColor);
    document.getElementById('statsNavEvolution').classList.remove(bgColor);
}


function renderEvolution(i) {
  generateEvolutionHTML();

  for (let j = 0; j < loadedPokemonGerman[i]['evo-Images'].length; j++) {
    const element = loadedPokemonGerman[i]['evo-Images'][j];
    document.getElementById(`evo${j}`).src = element;
  }
  
  let bgColor = loadedPokemonGerman[i]['color'];
  document.getElementById('statsNavStats').classList.remove(bgColor);
  document.getElementById('statsNavAbout').classList.remove(bgColor);
  document.getElementById('statsNavEvolution').classList.add(bgColor);
}


async function nextPokemon(i) {
    deactivatedModal = false;
    if (contentLoading) {
        return;
    }

    i = i + 1;
    if (i == pokemonLoaded - 1) {
        contentLoading = true;
        await loadMorePokemon();
        contentLoading = false;
    }
    openModal(i);
}


function prevPokemon(i) {
    deactivatedModal = false
    i = i - 1;
    openModal(i);
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