// Template for small Cards in whole List
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


// Generates basic structre of Modal to render all data in
function generateModalBasicHTML(i) {
    return `
            <div onclick="doNotClose(event); prevPokemon(${i})" id="prev-pokemon-btn" class="prevPokemon-container">
                <img id="prevPokemon" src="" alt="">
            </div>

            <div id="pokedex" onclick="doNotClose(event)">
                
                <img id="pokeball-bg" src="src/img/pokeball-bg.png" alt="">
                <div id="pokedexOverview">
                    <div id="cardHeading">
                        <span id="pokedexName"></span>
                        <span id="pokedexId"></span>
                    </div>
                    <div id="pokedexTypes">

                    </div>
                    
                    <img id="pokedexSprite" src="" alt="">
                </div>

                <div id="pokedexStats">
                    <nav id="pokedexStatsNav">

                    </nav>

                    <div id="pokedexStatsLower">

                    </div>
                </div>
            </div>

            <div onclick="doNotClose(event); nextPokemon(${i})" id="next-pokemon-btn" class="nextPokemon-container">
                <img id="nextPokemon" src="" alt="">
                <div id="loading-indicator" class="d-none">Lädt...</div>
            </div>
    `;
}


// Generate Modal Template just for the first Modal with placeholder Div to keep layout from disrupting
function generateFirstModalBasicHTML(i) {
    return `
            <div class="prevPokemon-container-placeholder" id="prev-pokemon-btn"> 
            </div>

            <div id="pokedex" onclick="doNotClose(event)">

            <img id="pokeball-bg" src="src/img/pokeball-bg.png" alt="">
                <div id="pokedexOverview">
                    <div id="cardHeading">
                        <span id="pokedexName"></span>
                        <span id="pokedexId"></span>
                    </div>
                    <div id="pokedexTypes">

                    </div>
                   
                    <img id="pokedexSprite" src="" alt="">
                </div>

                <div id="pokedexStats">
                    <nav id="pokedexStatsNav">

                    </nav>

                    <div id="pokedexStatsLower">

                    </div>
                </div>
            </div>

            <div onclick="doNotClose(event); nextPokemon(${i})" id="next-pokemon-btn" class="nextPokemon-container">
                <img id="nextPokemon" src="" alt="">
                <div id="loading-indicator" class="d-none">Lädt...</div>
            </div>
    `;
}


// Generates Template for opened Modal => Lower half of Card: Mini Nav Bar
function generateModalNavHTML(i) {
    document.getElementById('pokedexStatsNav').innerHTML = `
    <button id="statsNavAbout" onclick="renderAbout(${i})" class="btn">Übersicht</button>
    <button id="statsNavStats" onclick="renderStats(${i})" class="btn">Basiswerte</button>
    <button id="statsNavEvolution" onclick="renderEvolution(${i})" class="btn">Evolution</button>
    `;
}


// Generates Template for opened Modal => Lower half of Card: Overview/ About
function generateModalLowerAboutHTML() {
    document.getElementById('pokedexStatsLower').innerHTML = `
    <table id="about-display">
    <thead>
        <tr>
            <td>Kategorie</td>
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

    <div class="modal-footer-container">
        <div id="pokedex-lower-line">
            <img src="src/img/favicon.png" alt=""> 
        </div>
    </div>
    `;
}


// Generates Template for opened Modal => Lower half of Card: Stats with Graph
function generateModalLowerStatsHTML() {
    document.getElementById('pokedexStatsLower').innerHTML = `
    <canvas id="myChart"></canvas>
    <div class="modal-footer-container">
    <div id="pokedex-lower-line">
        <img src="src/img/favicon.png" alt="">
    </div>
    </div>
    `;
}


// Generates Template for opened Modal => Lower half of Card: Evolution Chain
function generateEvolutionHTML() {
    document.getElementById('pokedexStatsLower').innerHTML = `
    <div class="evo-container">
        <div>
            <img id="evo0" src="">
            <img id="arrow1" class="arrow d-none" src="./src/img/right-arrow.png">
            <img id="evo1"src="">
            <img id="arrow2" class="arrow d-none" src="./src/img/right-arrow.png">
            <img id="evo2" src="">
        </div>

        <div class="modal-footer-container">
        <div id="pokedex-lower-line">
            <img src="src/img/favicon.png" alt=""> 
        </div>
    
    </div>
    `;
}


// Generates the Graph itself
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