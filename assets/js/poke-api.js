
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function convertPokeApiDetailToStats(statsDetail) {
    const stats = new Stats()
    stats.xp = statsDetail.base_experience
    stats.height = statsDetail.height
    stats.weight = statsDetail.weight
    stats.hp = statsDetail.stats[0].base_stat
    stats.atk = statsDetail.stats[1].base_stat
    stats.def = statsDetail.stats[2].base_stat
    stats.spAtk = statsDetail.stats[3].base_stat
    stats.spDef = statsDetail.stats[4].base_stat
    stats.speed = statsDetail.stats[5].base_stat

    return stats
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getStats = (url) => {
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToStats)
        .then((statsDetails) => statsDetails)
}