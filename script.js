let allPokemon = [];
let visibleCount = 20;
const maxPokemon = 100;


async function init() {
    await loadPokemons();

    const input = document.getElementById("searchPokemon");
    input.addEventListener("input", filterPokemon);
}

function showLoader() {
    const container = document.getElementById("image_load");
    container.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Load Pokemon...</p>
        </div>
    `;
}

function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) { loader.remove(); }
}

async function loadPokemons() {
    try {
        showLoader();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}&offset=0`);
        const data = await response.json();
        await loadPokemonDetails(data);

        renderPokemon();

        hideLoader();

    } catch (error) {
        console.error(error);
    }
}

async function loadPokemonDetails(data) {
    const promises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const pokeData = await res.json();
        return pokeData;
    });
    allPokemon = await Promise.all(promises);
}

async function loadIcons(pokemon) {
    const icons = await Promise.all(
        pokemon.types.map(pokemon => getTypeIcon(pokemon.type.url))
    );

    let typesHTML = "";
    icons.forEach(icon => {
        if (icon) { typesHTML += `<img src="${icon}" class="type-icon">`; }
    });
    return typesHTML;
}

async function getTypeIcon(typeUrl) {
    const typeCache = {};

    if (typeCache[typeUrl]) { return typeCache[typeUrl]; }

    const response = await fetch(typeUrl);
    const data = await response.json();

    const icon = data.sprites["generation-vii"]["lets-go-pikachu-lets-go-eevee"].symbol_icon;

    typeCache[typeUrl] = icon;
    return icon;
}

async function renderPokemon(filteredList = allPokemon) {
    const containerPokemonLoad = document.getElementById("image_load");
    containerPokemonLoad.innerHTML = "";

    const visiblePokemon = filteredList.slice(0, visibleCount);

    for (const pokemon of visiblePokemon) {
        const index = allPokemon.indexOf(pokemon);
        const mainType = pokemon.types[0].type.name;

        typesHTML = await loadIcons(pokemon);

        containerPokemonLoad.innerHTML += getPokemons(mainType, index, pokemon, typesHTML);
    }
    createLoadButton(visibleCount, filteredList)

}

function createLoadButton(visibleCount, filteredList) {
    const buttonContainer = document.getElementById("button_load");

    if (visibleCount === 20) {
        return buttonContainer.innerHTML = getLoadMoreButton();
    }
    if (visibleCount >= filteredList.length) {
        return buttonContainer.innerHTML = getLoadLessButton();        
    }
    
    return buttonContainer.innerHTML = getLoadMoreAndLessButton();
}

function changeVisibleCount(amount) {
    visibleCount += amount;
    renderPokemon();
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

    renderPokemon(filtered);
}

// ---------------- Dialog ----------------
async function openDialog(index) {
    const pokemon = allPokemon[index];
    const dialog = document.getElementById("pictureDialog");

    document.getElementById("name_img").innerText = pokemon.name;

    typesHTML = await loadIcons(pokemon);

    document.getElementById("dialogMain").innerHTML = `
        <img src="${pokemon.sprites.other.home.front_default}">
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
        <p><strong>Type:</strong> ${typesHTML}</p>
    `;

    document.getElementById("dialogFooter").innerHTML = `
        <button aria-label="Dialog switch image left" onclick="onclick="prevPokemon(${index})" class="leftRightButton">
            &blacktriangleleft;
        </button>
        <button aria-label="Dialog switch image right" onclick="nextPokemon(${index})" class="leftRightButton">
            &blacktriangleright;
        </button>`;




    dialog.showModal();
}

function closeDialog() {
    document.getElementById("pictureDialog").close();
}

function eventBubbling(event) {
    event.stopPropagation();
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
    if (!dialog.open) return;

    const name = document.getElementById("name_img").innerText;
    const index = allPokemon.findIndex(p => p.name === name);

    if (event.key === "ArrowRight") nextPokemon(index);
    if (event.key === "ArrowUp") nextPokemon(index);
    if (event.key === "ArrowLeft") prevPokemon(index);
    if (event.key === "ArrowDown") prevPokemon(index);
}