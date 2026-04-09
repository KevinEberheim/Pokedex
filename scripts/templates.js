function getLoader() {
    return `
        <div class="loader">
            <div class="spinner"></div>
            <p>Load Pokemon...</p>
        </div>
        `;
}


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


function getDialogContent(mainType, pokemon, typesHTML, index){
    return `
        <div class="dialogMainImg">
            <div class="bg_${mainType} min_height_250 justify_center">
            <img src="${pokemon.sprites.other.home.front_default}" class="pictureDialogclass_img">
            </div>
            <div class="types">${typesHTML}</div>
        </div>

        <div class="tabs">
            <button onclick="showTab('main', ${index})">Main</button>
            <button onclick="showTab('stats', ${index})">Stats</button>
            <button onclick="showTab('evo', ${index})">EvoChain</button>
        </div>

        <div id="tabContent" class="tabsContent"></div>
    `;
}

function getDialogMain(height, weight, pokemon, abilities){
    return `
        <p><strong>Height:</strong> ${height.toFixed(1)} m </p>
        <p><strong>Weight:</strong> ${weight.toFixed(1)} kg </p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience} </p>
        <p><strong>Abilities:</strong> ${abilities} </p>
    `;
}

function getDialogStats(stat, percent){
    return `
            <div class="stat-row">
                <div class="stat-name">
                <span> ${stat.stat.name}</span>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
}

function getDialogEvo(name, img) {
    return `
        <div class="evo-item">
            <img src="${img}" class="evo_Img">
            <p>${name}</p>
        </div>
    `;
}

function getFooterDialog(index){
    return `
        <button aria-label="Dialog switch image left" onclick="prevPokemon(${index})" class="leftRightButton">
            &blacktriangleleft;
        </button>
        <button aria-label="Dialog switch image right" onclick="nextPokemon(${index})" class="leftRightButton">
            &blacktriangleright;
        </button>
        `;
}