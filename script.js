// ---------------- Typfarben ----------------
const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};

// ---------------- Globale Variablen ----------------
let allPokemon = [];
let visibleCount = 20;
const maxPokemon = 100;

// ---------------- Init-Funktion ----------------
async function init() {
    await loadPokemon();

    // 🔍 Suche aktivieren
    const input = document.querySelector("input");
    input.addEventListener("input", filterPokemon);
}

// ---------------- Ladeanimation ----------------
function showLoader() {
    const container = document.getElementById("image_load");
    container.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Lade Pokémon...</p>
        </div>
    `;
}

function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) loader.remove();
}

// ---------------- Pokémon laden (alle auf einmal) ----------------
async function loadPokemon() {
    try {
        showLoader();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}&offset=0`);
        const data = await response.json();

        // Parallel alle Details laden
        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const pokeData = await res.json();
            return pokeData;
        });

        allPokemon = await Promise.all(promises);

        renderPokemon();

    } catch (e) {
        console.error(e);
    } finally {
        hideLoader();
    }
}

// ---------------- Pokémon anzeigen ----------------
function renderPokemon(filteredList = allPokemon) {
    const container = document.getElementById("image_load");
    container.innerHTML = "";

    const visiblePokemon = filteredList.slice(0, visibleCount);

    visiblePokemon.forEach((pokemon) => {
        const index = allPokemon.indexOf(pokemon);
        const mainType = pokemon.types[0].type.name;
        const bgColor = typeColors[mainType] || "#ccc";

        const typesHTML = pokemon.types.map(t => t.type.name).join(", ");

        container.innerHTML += `
            <div class="pokemon_card" 
                 onclick="openDialog(${index})"
                 style="background-color: ${bgColor}">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <p>${typesHTML}</p>
            </div>
        `;
    });

    // Mehr laden Button nur wenn noch Pokémon übrig
    if (visibleCount < filteredList.length) {
        document.getElementById("button_load").innerHTML = `
            <button onclick="loadMore()" class="load_more_btn">
                Mehr laden
            </button>
        `;
    }
    else{
        document.getElementById("button_load").innerHTML = "";
    }
}

// ---------------- Mehr laden ----------------
function loadMore() {
    visibleCount += 20;

    const input = document.querySelector("input");
    const value = input.value.toLowerCase();

    if (value.length >= 3) {
        const filtered = allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(value)
        );
        renderPokemon(filtered);
    } else {
        renderPokemon();
    }
}

// ---------------- Suchfunktion ----------------
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
function openDialog(index) {
    const pokemon = allPokemon[index];
    const dialog = document.getElementById("pictureDialog");

    document.getElementById("name_img").innerText = pokemon.name;

    const typesHTML = pokemon.types.map(t => t.type.name).join(", ");

    document.getElementById("dialogMain").innerHTML = `
        <img src="${pokemon.sprites.front_default}">
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
        <p><strong>Type:</strong> ${typesHTML}</p>
    `;

    document.getElementById("dialogFooter").innerHTML = `
        <button onclick="prevPokemon(${index})">⬅️</button>
        <button onclick="nextPokemon(${index})">➡️</button>
    `;

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
    if (event.key === "ArrowLeft") prevPokemon(index);
}