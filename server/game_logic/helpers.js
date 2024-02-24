const rand_range = (a, b) => {
    ( Math.random() * (b-a) ) + a
}

const GEN_SPAWN_LOC = () => {
    return [
        rand_range(MAP_SIZE * (1 - SPAWN_BOUND), MAP_SIZE * SPAWN_BOUND),
        rand_range(MAP_SIZE * (1 - SPAWN_BOUND), MAP_SIZE * SPAWN_BOUND)
    ]
}

module.exports = {
    GEN_SPAWN_LOC
}