function renderListOfPokemon() {
    let data = loadedPokemonGerman;
    document.getElementById('listOfPokemon').innerHTML = '';
    document.getElementById('search-input').value = '';

    for (let i = 0; i < loadedPokemonGerman.length; i++) {
        generateSingleCard(i);
    }

    for (let j = 0; j < data.length; j++) {
        document.getElementById(`pokemon${j}`).classList.remove('d-none'); // Makes all new loaded Cards reveal simultaneously
    }
}


function generateSingleCard(i) {
    let pokemonName = loadedPokemonGerman[i]['name'];
    let pokemonFlavor = loadedPokemonGerman[i]['flavor']; // Description of pokemon
    let pokemonID = loadedPokemonGerman[i]['id'].toString().padStart(3, "0");
    let pokemonImage = loadedPokemonGerman[i]['image'];
    let pokemonColor = loadedPokemonGerman[i]['color']; // Color of Pokemon used as BG-CSS-Class

    document.getElementById('listOfPokemon').innerHTML += singlePokemonCardHTML(i, pokemonName, pokemonID, pokemonImage, pokemonColor, pokemonFlavor);
    renderPokemonTypeLabels(i);
}


function renderPokemonTypeLabels(j) {
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


function checkForFirstCardModal(i) {
    // Generates different HTML template wether or not its the first pokemon Modal opened
    if (i > 0) {
        let prevPokemon = loadedPokemonGerman[i - 1]['image'];
        document.getElementById('card-modal').innerHTML = generateModalBasicHTML(i);
        document.getElementById('prevPokemon').src = prevPokemon;
    } else {
        document.getElementById('card-modal').innerHTML = generateFirstModalBasicHTML(i);
    }
}


function renderBaseData(i) {
    let pokemonName = loadedPokemonGerman[i]['name'];
    let pokemonID = loadedPokemonGerman[i]['id'].toString().padStart(3, "0");
    let pokemonImage = loadedPokemonGerman[i]['image'];
    let pokemonColor = loadedPokemonGerman[i]['color']; // Color of Pokemon used as BG-CSS-Class
    let nextPokemon = loadedPokemonGerman[i + 1]['image'];

    document.getElementById('pokedexName').innerHTML = pokemonName;
    document.getElementById('pokedexId').innerHTML = '#' + pokemonID;
    document.getElementById('pokedexSprite').src = pokemonImage;
    document.getElementById('nextPokemon').src = nextPokemon;
    document.getElementById('pokedex').classList.add(pokemonColor);
}


function renderTypes(i) {
    for (let j = 0; j < loadedPokemonGerman[i].types.length; j++) {
        let englishType = loadedPokemonGerman[i].types[j];
        let germanType = germanTypes[englishType];

        document.getElementById(`pokedexTypes`).innerHTML += `
         <div class="${englishType} type">
             ${germanType}
         </div>
     `;
    }
}


function animateOpenModal() {
    document.getElementById('card-modal').classList.add('modal-animation');
    document.getElementById('header').classList.add('blur');
    document.getElementById('listOfPokemon').classList.add('blur');
    document.getElementById('load-button').classList.add('blur');
    document.getElementById('footer').classList.add('blur');
}


function renderAbout(i) {
    generateModalLowerAboutHTML();
    let aboutHeight = loadedPokemonGerman[i]['height'] * 0.1; // Calc from dezimeter to meter
    let aboutWeight = loadedPokemonGerman[i]['weight'] * 0.1; // Calc from hectogram to kilogram

    aboutHeight = aboutHeight.toLocaleString('de-DE', {
        maximumFractionDigits: 2
    }) + ' m';

    aboutWeight = aboutWeight.toLocaleString('de-DE', {
        maximumFractionDigits: 2
    }) + ' kg';

    settingAboutHTML(i, aboutHeight, aboutWeight);
    highlightAboutBtn(i);
}


function settingAboutHTML(i, aboutHeight, aboutWeight) {
    let aboutSpecies = loadedPokemonGerman[i]['genera'];
    let aboutAbilities = loadedPokemonGerman[i].abilities['ability-Name'];

    document.getElementById('about-species').innerHTML = aboutSpecies;
    document.getElementById('about-height').innerHTML = aboutHeight;
    document.getElementById('about-weight').innerHTML = aboutWeight;
    document.getElementById('about-abilities').innerHTML = aboutAbilities.join(', ');
}


function renderStats(i) {
    generateModalLowerStatsHTML();

    const ctx = document.getElementById('myChart');
    const label = loadedPokemonGerman[i].stats.key;
    const value = loadedPokemonGerman[i].stats.value;

    createNewChart(ctx, label, value);
    highlightStatsBtn(i)
}


function renderEvolution(i) {
    generateEvolutionHTML();
    for (let j = 0; j < loadedPokemonGerman[i]['evo-Images'].length; j++) {
        document.getElementById(`evo${j}`).src = loadedPokemonGerman[i]['evo-Images'][j];

        if (j == 1) {
            document.getElementById('arrow1').classList.remove('d-none');
        }

        if (j == 2) {
            document.getElementById('arrow2').classList.remove('d-none');
        }
    }
    highlightEvolutionBtn(i);
}


function highlightAboutBtn(i) {
    let bgColor = loadedPokemonGerman[i]['color'];
    document.getElementById('statsNavAbout').classList.add(bgColor);
    document.getElementById('statsNavStats').classList.remove(bgColor);
    document.getElementById('statsNavEvolution').classList.remove(bgColor);
}


function highlightEvolutionBtn(i) {
    let bgColor = loadedPokemonGerman[i]['color'];
    document.getElementById('statsNavAbout').classList.remove(bgColor);
    document.getElementById('statsNavStats').classList.remove(bgColor);
    document.getElementById('statsNavEvolution').classList.add(bgColor);
}

function highlightStatsBtn(i) {
    let bgColor = loadedPokemonGerman[i]['color'];
    document.getElementById('statsNavAbout').classList.remove(bgColor);
    document.getElementById('statsNavStats').classList.add(bgColor);
    document.getElementById('statsNavEvolution').classList.remove(bgColor);
}


function toggleLoadingIndicator() {
    let btn = document.getElementById('loading-indicator');

    btn.classList.toggle('d-none');
    btn.classList.toggle('loading-indicator');
}


function prevPokemon(i) {
    deactivatedModal = false
    i = i - 1;
    openModal(i);
}


// Animates loading more Pokemon Button at bottom of page
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