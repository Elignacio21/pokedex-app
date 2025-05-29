// === DOM ELEMENT REFERENCES ===
// Input field where the user types the Pokémon name or ID.
const $input = document.querySelector(".seeker__input-item")

// Button used to trigger the search.
const $btn = document.querySelector(".seeker__serch")

// Image element to display the Pokémon.
const $img = document.querySelector(".img-container__image")

// Paragraph element to display the Pokémon's name and ID.
const $nameDetaills = document.querySelector(".name__paragraph") 

// Paragraph element to display the Pokémon's description.
const $descDetaills = document.querySelector(".desc__paragraph")

// Paragraph element to display the Pokémon's types.
const $typeDetaills = document.querySelector(".type__paragraph")

// Paragraph element to display the Pokémon's height and weight.
const $dimensionsDetails = document.querySelector(".dimensions__paragraph")

// Element to show status messages (e.g., loading, success).
const $state = document.querySelector(".state")

// Element to display error messages.
const $errors = document.querySelector(".errorMJ")

// Fetches data for a specific Pokémon from the PokéAPI
async function getData(pokemonName){
    try {
        let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        if(!result.ok){throw new Error(" Pokemon not found")}

        let json = await result.json()
        return json
    } catch (error) {
        $errors.textContent = `Error:${error.message || "A ocurrido un Error"}`
    }
}

// Fetches data for a specific species of pokemon from the PokéAPI
async function getDataSpecies(pokemonName){
    try {
        let result = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        if(!result.ok){throw new Error(" Pokemon not found")}

        let json = await result.json()
        
        return json
    } catch (error) {
        $errors.textContent = `Error:${error.message || "A event error"}`
    }
}

// Fetches data for a specific chain evolute of pokemon from the PokéAPI
async function getEvoluted(url){
    try {
        let result = await fetch(`${url}`)
        if(!result.ok){throw new Error(" A event error")}

        let json = await result.json()
        
        console.log("conexion exitosa")
        return json
    } catch (error) {
        $errors.textContent = `Error:${error.message && "A event error"}`
    }
}

// Receives an array of Pokémon names from an evolution chain,
// fetches their images from the PokéAPI, and displays them in the DOM
async function viweEvolutions(listEv){
    const container = document.querySelector(".detaills__figure")
    container.innerHTML = ` `
    for (let index = 0; index < listEv.length; index++) {
        const item = listEv[index];
        const $figure = document.createElement("img")
        $figure.classList.add("pokemon-evolution")
        let path = await getData(item)
        $figure.src = path.sprites.other.dream_world.front_default
        container.appendChild($figure)
    }
}

// Traverses an array of Pokémon types and appends each type as a <p> element into the .type__paragraph container.
// Throws an error if the array is empty.
function traverseTypes(arrayType){
    const $container = document.querySelector(".type__paragraph")
    $container.innerHTML = ` `

    if(arrayType.length == 0){throw new Error("Array empty")}
    $typeDetaills.textContent = ""
    for (let index = 0; index < arrayType.length; index++) {
        const item = arrayType[index];
        let elem = document.createElement("p")
        elem.textContent = item.type.name
        document.querySelector(".type__paragraph").appendChild(elem)
    }
}

// Converts height from decimeters to centimeters and weight from hectograms to kilograms.
function conversorHeight(height,weight){
    let heightInCm = height*10
    let weightInKg = weight/10;
    document.querySelector(".paragraph__height").textContent = `heigth:${heightInCm}Cm`
    document.querySelector(".paragraph__weight").textContent = `weight:${weightInKg}kg`
}

const typeColors = {
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
    fire: "#F08030",
}

function setHeaderColorByType(types){
    document.querySelector(".header").style.backgroundColor = typeColors[types] || "#000"
}

const typeColorsMain = {
    water: "#0B3D91",     
    grass: "#1B5E20",      
    electric: "#B8860B",   
    psychic: "#8B008B",    
    ice: "#4682B4",        
    dark: "#1C1C1C",       
    fairy: "#8B3A62",      
    normal: "#4D4D4D",     
    fighting: "#800000",  
    flying: "#2F4F4F",     
    poison: "#4B0082",    
    ground: "#8B4513",    
    rock: "#5C4033",      
    bug: "#556B2F",        
    ghost: "#2E0854",     
    steel: "#3C3C3C",     
    fire: "#8B2500",         
}

function setMainColorByType(types){
    document.querySelector("body").style.backgroundColor = typeColorsMain[types] || "#000"
}

// Recursively traverses a Pokémon evolution chain to collect species names from each node.
// Returns a flat array with all species involved in the evolution path.
function listEvoluted(nodo){
    const lista = [nodo.species.name]
    if(nodo.evolves_to.length > 0){
        let next = nodo.evolves_to[0]
        const nextPokemon = listEvoluted(next)
        lista.push(...nextPokemon)
    }
    return lista
}

// Updates the Pokémon image on the UI.
function viwePokemonImg(url){
    $img.src = url
}

// Updates the Pokémon name and ID in the details section.
function viwePokemonName(name){
    $nameDetaills.textContent = name
}


// Updates the Pokémon description in the details section.
function viwePokemonDesc(description){
    $descDetaills.textContent = description
}

// Displays all Pokémon-related information on the UI:
// - Types
// - Height and weight
// - Evolution chain
// - Image, name, and description
function displayPokemonInfo(data, dataSpecies,dataEvolution){
    traverseTypes(data.types)
    conversorHeight(data.height,data.weight)
    viweEvolutions(listEvoluted(dataEvolution.chain))
    viwePokemonImg(data.sprites.other.dream_world.front_default)
    viwePokemonName(`${data.species.name}(#${data.id})`)
    viwePokemonDesc(dataSpecies.flavor_text_entries[0].flavor_text);
}

function showErrorContainer() {
    document.querySelector(".container__error").style.display = "block"
}
function hideErrorContainer() {
    document.querySelector(".container__error").style.display = "none"
}

// Clears the error and state messages from the user interface.
function recet(){
    $errors.textContent=""
    $state.textContent=""
}

// Handles the form submission:
// - Validates the input value
// - Fetches data from the PokéAPI (general data, species, and evolution chain)
// - Updates the UI with types, height, weight, evolution chain, image, name, and description
// - Handles and displays errors if any occur
document.addEventListener("submit" ,async e=> {
    e.preventDefault()
    showErrorContainer()
    recet()
    
    let valor = $input.value.trim()
    if(valor === ""){throw new Error("Enter the Pokemon name or ID")} 
    
    $state.textContent = "loading..."
    try {
        let data = await getData(valor)
        let dataSpecies = await getDataSpecies(valor)
        let dataEvolution = await getEvoluted(dataSpecies.evolution_chain.url)
        setHeaderColorByType(data.types[0].type.name)
        setMainColorByType(data.types[0].type.name)
        displayPokemonInfo(data,dataSpecies,dataEvolution)
        recet()
        hideErrorContainer()
    }
    catch (error) {
        showErrorContainer()
        $errors.textContent = `Error:${error.message  && "Pokemon not Found"}`
        $state.textContent = ""
    }

})
