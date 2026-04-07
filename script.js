let allPokemon = [];
let typeCache = {};
let visibleCount = 20;
let maxLoadPokemon = 100;
let currentOffset = 0;
const DOM = {
    dialog: document.getElementById("pokemonDialog"),
    dialogMain: document.getElementById("dialogMain"),
    dialogFooter: document.getElementById("dialogFooter"),
    nameImg: document.getElementById("name_img"),
    pokemonLoad: document.getElementById("pokemon_load"),
    buttonLoad: document.getElementById("button_load"),
    searchInput: document.getElementById("searchPokemon"),
    noticeInput: document.getElementById("noticeInput")
};
// Alles mit fetchJSON funktion machen

async function init() {
    await loadPokemons();

    DOM.searchInput.addEventListener("input", filterPokemon);
}

function showLoader() {
    DOM.pokemonLoad.innerHTML = getLoader();
}

function hideLoader() {
    const loaders = document.getElementsByClassName("loader");
    if (loaders.length > 0) {
        loaders[0].remove();
    }
}

async function fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
}

async function loadPokemons() {
    try {
        showLoader();

        const dataPokemon = await fetchJSON(`https://pokeapi.co/api/v2/pokemon?limit=${maxLoadPokemon}&offset=${currentOffset}`);
        await loadPokemonDetails(dataPokemon);
        
        hideLoader();
        renderPokemon();

    } catch (error) {
        console.error(error);
    }
}

async function loadPokemonDetails(dataPokemon) {
    const dataPokemonDetails = dataPokemon.results.map(async (pokemon) => {
        const pokeData = await fetchJSON(pokemon.url);
        return pokeData;
    });
    
    let pokemonDetails = await Promise.all(dataPokemonDetails);    
    allPokemon = [...allPokemon, ...pokemonDetails];
}

async function loadIcons(pokemon) {
    const icons = await Promise.all(
        pokemon.types.map(pokemon => getTypeIcons(pokemon.type.url))
    );

    let typesHTML = "";
    icons.forEach(icon => {
        if (icon) { typesHTML += `<img src="${icon}" class="type-icon">`; }
    });
    return typesHTML;
}

async function getTypeIcons(typeUrl) {
    if (typeCache[typeUrl]) { return typeCache[typeUrl]; }

    const dataTypeIcons = await fetchJSON(typeUrl);

    const icon = dataTypeIcons.sprites["generation-vii"]["lets-go-pikachu-lets-go-eevee"].symbol_icon;

    typeCache[typeUrl] = icon;
    return icon;
}

async function renderPokemon(filteredList = allPokemon, isFiltered = false) {
    DOM.pokemonLoad.innerHTML = "";
    const visiblePokemon = filteredList.slice(0, visibleCount);
    const pokemonHTML = await Promise.all(
        visiblePokemon.map(async (pokemon) => {
            const index = allPokemon.indexOf(pokemon); // nur wenn nötig!
            const mainType = pokemon.types[0].type.name;
            const typesHTML = await loadIcons(pokemon);

            return getPokemons(mainType, index, pokemon, typesHTML);
        })
    );
    DOM.pokemonLoad.innerHTML = pokemonHTML.join("");
    updatePokemonUI(isFiltered, filteredList);
}

function updatePokemonUI(isFiltered, filteredList) {
    if (filteredList.length === 0) {
        DOM.pokemonLoad.innerHTML = "Pokemon not found!";
        DOM.buttonLoad.innerHTML = "";
        return;
    }

    if (!isFiltered) {
        createLoadButton(filteredList);
    } else {
        DOM.buttonLoad.innerHTML = "";
    }
}

function createLoadButton(filteredList) {
    if (visibleCount === 20) {
        return DOM.buttonLoad.innerHTML = getLoadMoreButton();
    }
    if (visibleCount > filteredList.length) {
        return DOM.buttonLoad.innerHTML = getLoadLessButton();
    }

    return DOM.buttonLoad.innerHTML = getLoadMoreAndLessButton();
}

function changeVisibleCount(amount) {
    if (visibleCount >= allPokemon.length && amount > 0) {
        currentOffset += 100;
        visibleCount += amount;
        loadPokemons();
    }
    else {
        visibleCount += amount;
        renderPokemon();
    }
}

function filterPokemon(event) {
    const value = event.target.value.toLowerCase();
    if (!value){
        DOM.noticeInput.innerHTML = "";
        renderPokemon();
        return;
    }
    if (value.length < 3) {
        DOM.noticeInput.textContent = "Need 3 or more letters";
        renderPokemon();
        return;
    }
    DOM.noticeInput.innerHTML = "";

    const filtered = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(value)
    );

    renderPokemon(filtered, true);
}






// ---------------- Dialog ----------------
async function openDialog(index) {
    const pokemon = allPokemon[index];
    const mainType = pokemon.types[0].type.name;
    DOM.nameImg.innerText = pokemon.name;

    let typesHTML = await loadIcons(pokemon);

    DOM.dialogMain.innerHTML = getDialogContent(mainType, pokemon, typesHTML, index);

    DOM.dialogFooter.innerHTML = getFooterDialog(index);

    showTab('main', index);

    DOM.dialog.showModal();
}

function closeDialog() {
    DOM.dialog.close();
}

function eventBubbling(event) {
    event.stopPropagation();
}

async function showTab(tab, index) {
    const pokemon = allPokemon[index];
    if (tab === "main") { return updateTab(getMainTab(pokemon), false); }
    if (tab === "stats") { return updateTab(getStatsTab(pokemon), false); }
    if (tab === "evo") { return updateTab(await getEvoTab(pokemon), true); }
}

function updateTab(content, isEvo) {
    const tabContent = document.getElementById("tabContent");
    tabContent.classList.toggle('evo-container', isEvo);
    tabContent.innerHTML = content;
}

function getMainTab(pokemon) {
    const height = pokemon.height / 10;
    const weight = pokemon.weight / 10;
    let abilities = pokemon.abilities.map(a => a.ability.name).join(", ")
    return getDialogMain(height, weight, pokemon, abilities);
}

function getStatsTab(pokemon) {
    return pokemon.stats.map(stat => {
        const value = stat.base_stat;
        const Max_STAT = 150;
        const percent = (value / Max_STAT) * 100;

        return getDialogStats(stat, percent);
    }).join("");
}

async function getEvoTab(pokemon) {
    try {
        const speciesData = await fetchJSON(pokemon.species.url);
        const evoData = await fetchJSON(speciesData.evolution_chain.url);

        const evoList = extractEvolutionNames(evoData.chain);

        return evoList.map((name, index) => {
            const evoPokemon = allPokemon.find(pokemon => pokemon.name === name);
            const img = getImageOfEvoPokemon(evoPokemon);
            const arrow = createEvoArrow(index, evoList);
            return getDialogEvo(name, img) + arrow;
        }).join("");

    } catch (error) {
        console.error("Fehler beim Laden der Evolution:", error);
        return "<p>Evolution konnte nicht geladen werden.</p>";
    }
}

function extractEvolutionNames(chain) {
    const evoList = [];
    let current = chain;

    while (current) {
        evoList.push(current.species.name);
        current = current.evolves_to[0];
    }

    return evoList;
}

function getImageOfEvoPokemon(evoPokemon) {
    let img = "";
    if (evoPokemon) { img = evoPokemon.sprites.other.home.front_default; }
    return img;
}

function createEvoArrow(index, evoList) {
    let arrow = "";
    if (index < evoList.length - 1) { arrow = "<span class='evo-arrow'> &rarr; </span>"; }
    return arrow;
}



// ---------------- Dialog Navigation ----------------
function nextPokemon(index) {
    if (index < allPokemon.length - 1) {
        openDialog(index + 1);
    }
}

function prevPokemon(index) {
    if (index > 0) {
        openDialog(index - 1);
    }
}

function pressArrowKey(event) {
    if (!DOM.dialog.open) { return; }

    const name = DOM.nameImg.innerText.toLowerCase();
    const index = allPokemon.findIndex(p => p.name === name);

    if (event.key === "ArrowRight") { nextPokemon(index); }
    if (event.key === "ArrowUp") { nextPokemon(index); }
    if (event.key === "ArrowLeft") { prevPokemon(index); }
    if (event.key === "ArrowDown") { prevPokemon(index); }
}