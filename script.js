let allPokemon = [];
let typeCache = {};
let visibleCount = 20;
let maxPokemon = 100;
let currentOffset = 0;


async function init() {
    await loadPokemons();

    const input = document.getElementById("searchPokemon");
    input.addEventListener("input", filterPokemon);
}

function showLoader() {
    const containerLoader = document.getElementById("image_load");
    containerLoader.innerHTML = getLoader();
}

function hideLoader() {
    const loaders = document.getElementsByClassName("loader");
    if (loaders.length > 0) {
        loaders[0].remove();
    }
}

async function loadPokemons() {
    try {
        showLoader();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}&offset=${currentOffset}`);
        const data = await response.json();
        await loadPokemonDetails(data);

        hideLoader();
        renderPokemon();

    } catch (error) {
        console.error(error);
    }
}

async function loadPokemonDetails(data) {
    const promises = data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const pokeData = await response.json();
        return pokeData;
    });
    let pokemonDetails = await Promise.all(promises);
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

    const response = await fetch(typeUrl);
    const data = await response.json();

    const icon = data.sprites["generation-vii"]["lets-go-pikachu-lets-go-eevee"].symbol_icon;

    typeCache[typeUrl] = icon;
    return icon;
}

async function renderPokemon(filteredList = allPokemon, isFiltered = false) {
    const containerPokemonLoad = document.getElementById("image_load");
    containerPokemonLoad.innerHTML = "";
    const buttonContainer = document.getElementById("button_load");
    const visiblePokemon = filteredList.slice(0, visibleCount);

    const pokemonHTML = await Promise.all(
        visiblePokemon.map(async (pokemon) => {
            const index = allPokemon.indexOf(pokemon); // nur wenn nötig!
            const mainType = pokemon.types[0].type.name;
            const typesHTML = await loadIcons(pokemon);

            return getPokemons(mainType, index, pokemon, typesHTML);
        })
    );
    containerPokemonLoad.innerHTML = pokemonHTML.join("");

    if (!isFiltered) {
        createLoadButton(filteredList);
    }
    else {
        buttonContainer.innerHTML = "";
    }

}

function createLoadButton(filteredList) {
    const buttonContainer = document.getElementById("button_load");

    if (visibleCount === 20) {
        return buttonContainer.innerHTML = getLoadMoreButton();
    }
    if (visibleCount > filteredList.length) {
        return buttonContainer.innerHTML = getLoadLessButton();
    }

    return buttonContainer.innerHTML = getLoadMoreAndLessButton();
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

    if (value.length < 3) {
        renderPokemon();
        return;
    }

    const filtered = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(value)
    );

    renderPokemon(filtered, true);
}






// ---------------- Dialog ----------------
async function openDialog(index) {
    const pokemon = allPokemon[index];
    const dialog = document.getElementById("pictureDialog");
    const mainType = pokemon.types[0].type.name;

    document.getElementById("name_img").innerText = pokemon.name;

    let typesHTML = await loadIcons(pokemon);

    document.getElementById("dialogMain").innerHTML = getDialogContent(mainType, pokemon, typesHTML, index);

    document.getElementById("dialogFooter").innerHTML = getFooterDialog(index);

    showTab('main', index);

    dialog.showModal();
}

function closeDialog() {
    document.getElementById("pictureDialog").close();
}

function eventBubbling(event) {
    event.stopPropagation();
}

async function showTab(tab, index) {
    const pokemon = allPokemon[index];
    let content = "";

    if (tab === "main") {
        content = getMainTab(pokemon);
    } else if (tab === "stats") {
        content = getStatsTab(pokemon);
    } else if (tab === "evo") {
        content = await getEvoTab(pokemon);
    }

    document.getElementById("tabContent").innerHTML = content;
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
        const max = 150; // typische Obergrenze
        const percent = (value / max) * 100;

        return getDialogStats(stat, percent);
    }).join("");
}

async function getEvoTab(pokemon) {
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();

    const evoResponse = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoResponse.json();

    const evoList = [];
    let current = evoData.chain;

    while (current) {
        evoList.push(current.species.name);
        current = current.evolves_to[0];
    }

    return evoList.map(name => `
        <div class="evo-item">
            <img src="https://img.pokemondb.net/sprites/home/normal/${name}.png" class="evo_Img">
            <p>${name}</p>
        </div>
    `).join("");
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
    const dialog = document.getElementById("pictureDialog");
    if (!dialog.open) { return; }

    const name = document.getElementById("name_img").innerText;
    const index = allPokemon.findIndex(p => p.name === name);

    if (event.key === "ArrowRight") { nextPokemon(index); }
    if (event.key === "ArrowUp") { nextPokemon(index); }
    if (event.key === "ArrowLeft") { prevPokemon(index); }
    if (event.key === "ArrowDown") { prevPokemon(index); }
}