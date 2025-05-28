const $input = document.querySelector(".seeker__input-item")
const $btn = document.querySelector(".seeker__serch")
const $img = document.querySelector(".img-container__image")

const $nameDetaills = document.querySelector(".name__paragraph") 
const $descDetaills = document.querySelector(".desc__paragraph")
const $typeDetaills = document.querySelector(".type__paragraph")
const $dimensionsDetails = document.querySelector(".dimensions__paragraph")
const $state = document.querySelector(".state")

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
        $errors.textContent = `Error:${error.message || "A event error"}`
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
    recet()
    let valor = $input.value.trim()
    
    $state.textContent = "loading..."
    try {
        let data = await getData(valor)
        let dataSpecies = await getDataSpecies(valor)
        let dataEvolution = await getEvoluted(dataSpecies.evolution_chain.url)

        if(valor === ""){throw new Error("Enter the Pokemon name or ID")}
        
        traverseTypes(data.types)
        conversorHeight(data.height,data.weight)
        viweEvolutions(listEvoluted(dataEvolution.chain))
        $img.src =data.sprites.other.dream_world.front_default
        $nameDetaills.textContent = `${data.species.name}(#${data.id})`
        $descDetaills.textContent = dataSpecies.flavor_text_entries[0].flavor_text
        recet()
        }
        
    catch (error) {
        $state.textContent = ""
        $errors.textContent = `Error:${error?.message && "A event error"}`
    }

})
