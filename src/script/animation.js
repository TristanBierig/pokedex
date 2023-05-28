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

    let pokemonName = loadedPokemonGerman[i]['name'];
    let pokemonID = loadedPokemonGerman[i]['id'].toString().padStart(3, "0");
    let pokemonImage = loadedPokemonGerman[i]['image']; // URL of Image of Pokemon
    let pokemonColor = loadedPokemonGerman[i]['color']; // Color of Pokemon used as BG-CSS-Class
    let nextPokemon = loadedPokemonGerman[i + 1]['animation'];

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
    let aboutHeight = loadedPokemonGerman[i]['height'] * 0.1;
    let aboutWeight = loadedPokemonGerman[i]['weight'] * 0.1;
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


function createNewChart(ctx, label, value) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: 'Basiswert',
                data: value,
                borderWidth: 1,
                backgroundColor: [
                    'rgba(42, 192, 122, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(122, 84, 93, 0.2)',
                    'rgba(25, 74, 107, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                ],
                borderColor: [
                    'rgb(42, 192, 122)',
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(122, 84, 93)',
                    'rgba(25, 74, 107)',
                    'rgba(255, 205, 86',
                ]
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


function generateModalNavHTML(i) {
    document.getElementById('pokedexStatsNav').innerHTML = `
                        <button id="statsNavAbout" onclick="renderAbout(${i})" class="btn">Übersicht</button>
                        <button id="statsNavStats" onclick="renderStats(${i})" class="btn">Basiswerte</button>
                        <button id="statsNavEvolution" onclick="renderEvolution(${i})" class="btn">Evolution</button>
    `;
}


function generateModalLowerAboutHTML() {
    document.getElementById('pokedexStatsLower').innerHTML = `
    <table id="about-display">
    <thead>
        <tr>
            <td>Spezies</td>
            <td id="about-species"></td>
        </tr>
        <tr>
            <td>Größe</td>
            <td id="about-height"></td>
        </tr>
        <tr>
            <td>Gewicht</td>
            <td id="about-weight"></td>
        </tr>
        <tr>
            <td>Fähigkeiten</td>
            <td id="about-abilities"></td>
        </tr>
    </thead>
    </table>

<div id="pokedex-lower-line"><img src="src/img/favicon.png" alt=""></div>
    `;
}


function generateModalLowerStatsHTML() {
    document.getElementById('pokedexStatsLower').innerHTML = `
    <canvas id="myChart"></canvas>
    <div id="pokedex-lower-line"><img src="src/img/favicon.png" alt=""></div>
    `;
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