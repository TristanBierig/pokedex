let pokemonLoaded = 0;
let pokemonRendered = 0;
let pokemonLoadedMax = 20; // Defines number of pokemon getting loaded in one run. If change, then setNewStartForLoad() numbers have to be changed accordingly
let contentLoading = false;
let statsNameData = [];
let statsNameDataLoaded = false;
let evo;
let deactivatedModal = false;
let currentModal;


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
    setNewStartForLoad();
    resetFetchedCachedData();
    removeLoadingScreen();
}


async function loadMorePokemon() {
    toggleLoadingButtonAnimation();
    await fetchAllPokemonData();
    await createGermanJson();
    renderListOfPokemon();
    setNewStartForLoad();
    resetFetchedCachedData();
    toggleLoadingButtonAnimation();
}


async function openModal(i) {
    if (deactivatedModal) return;
    deactivatedModal = true;
    disableScroll()
    currentModal = i;

    if (i == pokemonLoaded - 1) { // Checks if clicked Pokemon is last loaded and loads the next bunch
        await loadMorePokemon();
    }
    await processGermanAbilityData(i);
    await processEvolutionData(i);
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
    enableScroll()

    document.getElementById('header').classList.remove('blur');
    document.getElementById('listOfPokemon').classList.remove('blur');
    document.getElementById('load-button').classList.remove('blur');
    document.getElementById('card-modal').classList.remove('modal-animation');
    document.getElementById('footer').classList.remove('blur');
    document.getElementById('top-btn').classList.remove('blur');

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


function setNewStartForLoad() {
    pokemonRendered = pokemonRendered + 20; // Sets new starting point for next Loading Loop
    pokemonLoadedMax = pokemonLoadedMax + 20; // Sets new starting point for next Loading Loop
}


function removeLoadingScreen() {
    document.getElementById('first-load').classList.add('o-none');
    setTimeout(() => {
        document.getElementById('first-load').classList.add('d-none');
    }, 500);
}


// Mobile Swipe Navigation
document.addEventListener('swiped-left', function (e) {
    if (deactivatedModal) {
        swipeNext();
    }
});


document.addEventListener('swiped-up', function (e) {
    closeModal();
});


document.addEventListener('swiped-right', function (e) {
    swipePrev();
});


function swipeNext() {
    deactivatedModal = false;
    let index = currentModal + 1;
    openModal(index);
}


function swipePrev() {
    let index = currentModal - 1;
    if (index >= 0) {
        deactivatedModal = false;
        openModal(index);
    }
}


function disableScroll(){
  document.getElementById('body').classList.add('no-scroll');
}

function enableScroll(){
    document.getElementById('body').classList.remove('no-scroll');
}