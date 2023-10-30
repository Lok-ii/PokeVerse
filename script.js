let container = document.querySelector("main");
let form = document.querySelector("form");
let reset = document.querySelector(".reset");
let select = document.querySelector("select");
let input = document.querySelector("input");

let addTypeOptions = async () => {
  let fetchTypes = await fetch(`https://pokeapi.co/api/v2/type/`);
  let typeList = await fetchTypes.json();
  let selectList = document.querySelector(".select");

  typeList.results.forEach((element) => {
    if(!(element.name === "shadow" || element.name == "unknown")){
    let createOption = document.createElement("option");
    createOption.value = element.name;
    createOption.textContent = element.name;
    selectList.appendChild(createOption);
    }
  });
};

addTypeOptions();

let addPokemonCards = (dataPok) => {
  container.innerHTML = "";
  dataPok.forEach(async (element) => {
    let fetchPok = await fetch(element);
    let pokData = await fetchPok.json();

    let abilitiesArray = [];
    for (let j = 0; j < pokData.abilities.length; j++) {
      abilitiesArray.push(pokData.abilities[j].ability.name);
    }
    let abilities = abilitiesArray.join(", ");

    let typeName = pokData.types[0].type.name;
    let pokName = pokData.species.name;
    let image = "";
    if (pokData.sprites.other.dream_world.front_default === null) {
      image = pokData.sprites.other["official-artwork"].front_default;
    }else if(pokData.sprites.other["official-artwork"].front_default === null){
        image = pokData.sprites.front_default;
    } else {
      image = pokData.sprites.other.dream_world.front_default;
    }

    let backImage = pokData.sprites.back_default;

    if(pokData.sprites.back_default === null){
        backImage = pokData.sprites.front_default;
    }

    if (typeName === select.value || select.value === "type") {
      let createDiv = document.createElement("div");
      createDiv.className = "pokemon";
      createDiv.innerHTML = `<div class="poke-card  ${typeName}">
        <div class=front-card ${pokData.types[0].type.name}>
            <div class="serial">
                <p>#<span class="number">${pokData.id}</span></p>
            </div>
            <img class="svg" src="${image}" alt="">
            <p class="poke-name">${
              pokName[0].toUpperCase() + pokName.substr(1, pokName.length)
            }</p>
            <p class="poke-type">${typeName.toUpperCase()}</p>
        </div>
        <div class="back-card ${typeName}">
            <div class="serial">
                <p>#<span class="number">${pokData.id}</span></p>
            </div>
            <img src="${backImage}" alt="">
            <p class="poke-name">${
              pokName[0].toUpperCase() + pokName.substr(1, pokName.length)
            }</p>
            <p class="abilities">
                <span>Abilities: </span> <br> ${abilities}
            </p>
        </div>
    </div>`;
      container.appendChild(createDiv);
    }
  });
};

let fetchAllPokemons = async () => {
  let fetchPokemons = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`
  );
  let pokemonList = await fetchPokemons.json();
  let dataPok = [];
  pokemonList.results.forEach((e) => {
    dataPok.push(e.url);
  });

  addPokemonCards(dataPok);
};

window.onload = () => {
  fetchAllPokemons();
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let type = select.value;

  let fetchTypeList = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  let responseList = await fetchTypeList.json();
  let listArray = [];
  responseList.pokemon.forEach((ele) => {
    if (
      ele.pokemon.url.slice(-2, -3) <= 151 &&
      ele.pokemon.url.slice(-2, -4) <= 151 &&
      ele.pokemon.url.slice(-2, -4) <= 151
    ) {
      listArray.push(ele.pokemon.url);
    }
  });
  addPokemonCards(listArray);
});

reset.addEventListener("click", () => {
  window.location.reload();
});

input.addEventListener("input", async ()=>{
    let fetchNameData = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`);
    let nameData = await fetchNameData.json();
    console.log(nameData);
    let nameArray = [];

    nameData.results.forEach(element =>{
        if(element.name.includes(input.value)){
            nameArray.push(element.url);
        }
    });
    
    console.log(nameArray);
    addPokemonCards(nameArray);
});
