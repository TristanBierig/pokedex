let pokemonLoaded = 0;
let pokemonRendered = 0;
let pokemonLoadedMax = 20; // Defines number of pokemon getting loaded in one run. If change, then LOC 9 and 10 numbers in render.js have to be changed accordingly
let contentLoading = false;
let statsNameData = [];
let statsNameDataLoaded = false;
let evo;
let deactivatedModal = false;


// Needed to cache Data for creating production JSON
/* ========== */
let pokemonRequests1 = [];
let pokemonRequests2 = [];
let pokemonRequestsAbility = [];
let pokemonRequestsStats = [];

let pokemonResponse1 = [];
let pokemonResponse2 = [];
let pokemonResponseAbility = [];
let pokemonResponseStats = [];

let pokemonData1 = [];
let pokemonData2 = [];
let pokemonDataAbility = [];
let pokemonDataStats = [];
/* ========== */



async function init() {
    await fetchAllPokemonData();
    await processGermanStatNameData();
    await createGermanJson();
    renderListOfPokemon();
    resetFetchedCachedData();
}


async function loadMorePokemon() {
    toggleLoadingButtonAnimation();
    await fetchAllPokemonData();
    await createGermanJson();
    renderListOfPokemon();
    resetFetchedCachedData();
    toggleLoadingButtonAnimation();
}


async function openModal(i) {
    if (deactivatedModal) return;
    deactivatedModal = true;

    if (i == pokemonLoaded - 1) { // Checks if clicked Pokemon is last loaded and loads the next bunch
        await loadMorePokemon();
    }
    checkForFirstCardModal(i);
    renderBaseData(i);
    renderTypes(i);
    generateModalNavHTML(i);
    renderAbout(i);
    animateOpenModal();
}


async function nextPokemon(i) {
    deactivatedModal = false;
    if (contentLoading) {
        return;
    }

    i = i + 1;
    if (i == pokemonLoaded - 1) {
        contentLoading = true;
        toggleLoadingIndicator();
        await loadMorePokemon();
        contentLoading = false;
        toggleLoadingIndicator();
    }
    openModal(i);
}


function closeModal() {
    if (contentLoading) {
        return;
    }

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


function doNotClose(event) {
    event.stopPropagation();
}