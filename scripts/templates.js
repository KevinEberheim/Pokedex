function getPokemons(mainType, index, pokemon, typesHTML) {
    return `
            <div class="pokemon_card bg_${mainType}" 
                 onclick="openDialog(${index})">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <div>${typesHTML}</div>
            </div>
            `;
}

function getLoadMoreButton() {
    return `
            <button onclick="changeVisibleCount(20)" class="load_btn">
                More Pokemon
            </button>
            `;
}

function getLoadLessButton() {
    return `
            <button onclick="changeVisibleCount(-20)" class="load_btn">
                Less Pokemon
            </button>
            `;
}

function getLoadMoreAndLessButton(){
    return `
            <button onclick="changeVisibleCount(20)" class="load_btn">
                More Pokemon
            </button>
            <button onclick="changeVisibleCount(-20)" class="load_btn">
                Less Pokemon
            </button>
            `;
}