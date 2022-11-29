const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById("pokeDetails")
const pokeDetails = document.getElementById("detailsContent")

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </li>
    `
}

function ConvertDetailsToLi(pokemon, stats) {
    console.log(pokemon)
    console.log(stats)
    return `
        <div class="details-header">
            <div class="details-name">
                ${pokemon.name}
            </div>
            <div class="details-number">
                #` + ("000" + pokemon.number).slice(-3) + `
            </div>
            <div class="details-types">
                <ol class="types-list">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            <div class="details-img">
                <img src="${pokemon.photo}" alt="">
            </div>
        </div>
        <div class="details-body">
            <div class="stats-header">
                <div class="stats-inline">
                    HP: ${stats.hp}
                </div>
                <div class="stats-inline">
                    XP: ${stats.xp}
                </div>
            </div>
            <div class="stats-text">
                Attack: ${stats.atk}
            </div>
            <div class="stats-text">
                Defense: ${stats.def}
            </div>
            <div class="stats-text">
                Speed: ${stats.speed}
            </div>
            <div class="stats-text">
                Special Attack: ${stats.spAtk}
            </div>
            <div class="stats-text">
                Special Defense: ${stats.spDef}
            </div>
            <div class="stats-footer">
                <div class="stats-inline">
                    Height: ${stats.height}
                </div>
                <div class="stats-inline">
                    Weight: ${stats.weight}
                </div>
            </div>
        </div>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit, false)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit, false)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit, false)
    }
})

async function showDetails(id) {
    url = `https://pokeapi.co/api/v2/pokemon/${id}/`
    pokemon = await pokeApi.getPokemonDetail({url})
    stats = await pokeApi.getStats(url)
    pokeDetails.innerHTML += ConvertDetailsToLi(pokemon, stats)
}

pokemonList.addEventListener('click',(event) => {
    let li = event.target.closest('li')
    
    if (event.target.classList.contains('type')) {
        li = event.target.parentElement.closest('li')
    }

    if (!li) return;

    if (!pokemonList.contains(li)) return

    showDetails(li.getElementsByClassName('number')[0].innerText.slice(1))

    modal.style.display = "flex"
    modal.getElementsByClassName('details-content')[0].classList.toggle(li.getElementsByClassName('type')[0].innerText)
  })
  
  modal.addEventListener('click', (e) => {
    if(e.target == modal) {
        let elemento = modal.getElementsByClassName('details-content')[0].classList[1]
        modal.style.display = "none"
        modal.getElementsByClassName('details-content')[0].classList.toggle(elemento)
        pokeDetails.innerHTML = ""
    }
})