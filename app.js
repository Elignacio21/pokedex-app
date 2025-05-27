const $input = document.querySelector(".seeker__input-item")
const $btn = document.querySelector(".seeker__serch")
const $img = document.querySelector(".img-container__image")

const $nameDetaills = document.querySelector(".name__paragraph") 
const $descDetaills = document.querySelector(".desc__paragraph")
const $typeDetaills = document.querySelector(".type__paragraph")
const $dimensionsDetails = document.querySelector(".dimensions__paragraph")
const $state = document.querySelector(".state")

const $errors = document.querySelector(".errorMJ")


async function getData(pokemonName){
    try {
        let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        if(!result.ok){throw new Error(" Pokemon no encontrado")}

        let json = await result.json()
        return json
    } catch (error) {
        $errors.textContent = `Error:${error.message || "A ocurrido un Error"}`
    }
}

async function getDataSpecies(pokemonName){
    try {
        let result = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        if(!result.ok){throw new Error(" Pokemon no encontrado")}

        let json = await result.json()
        
        return json
    } catch (error) {
        $errors.textContent = `Error:${error.message || "A ocurrido un Error"}`
    }
}

async function getEvoluted(url){
    try {
        let result = await fetch(`${url}`)
        if(!result.ok){throw new Error(" Pokemon no seccion no encontrada")}

        let json = await result.json()
        
        console.log("conexion exitosa")
        return json
    } catch (error) {
        $errors.textContent = `Error:${error.message || "A ocurrido un Error"}`
    }
}

function traverseTypes(arrayType){
    const $container = document.querySelector(".type__paragraph")
    $container.innerHTML = ` `

    if(arrayType.length == 0){throw new Error("Arreglo vacio")}
    $typeDetaills.textContent = ""
    for (let index = 0; index < arrayType.length; index++) {
        const item = arrayType[index];
        let elem = document.createElement("p")
        elem.textContent = item.type.name
        document.querySelector(".type__paragraph").appendChild(elem)
    }
}

function conversorHeight(height,weight){
    let heightInCm = height*10
    let weightInKg = weight/10;
    document.querySelector(".paragraph__height").textContent = `heigth:${heightInCm}Cm`
    document.querySelector(".paragraph__weight").textContent = `weight:${weightInKg}kg`
}

function listEvoluted(nodo){
    const lista = [nodo.species.name]
    if(nodo.evolves_to.length > 0){
        let next = nodo.evolves_to[0]
        const nextPokemon = listEvoluted(next)
        lista.push(...nextPokemon)
    }

    return lista
}

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


function recet(){
    $errors.textContent=""
    $state.textContent=""
}

document.addEventListener("submit" ,async e=> {
    e.preventDefault()
    recet()
    let valor = $input.value.trim()
    
    $state.textContent = "Cargando..."
    try {
        let data = await getData(valor)
        let dataSpecies = await getDataSpecies(valor)
        let dataEvolution = await getEvoluted(dataSpecies.evolution_chain.url)

        if(valor === ""){throw new Error("Ingrese el nombre del Pokemon o ID")}
        
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
        $errors.textContent = `Error:${error?.message && "A ocurrido un Error"}`
    }

})
