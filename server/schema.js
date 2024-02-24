const SERVER_DATA = {
    players : [],
    tokens : []
}

const PLAYER_DATA = {
    signature: "",
    tokens: [],
    physics: {
        position: [0, 0],
        direction: 0,
        velocity: [0, 0],
        cannon_balls: []
    },
}

const CANNON_BALL_DATA = {
    position: [0, 0],
    velocity: [0, 0],
    timer: 0,
    radius: 0,
    sender: ""
}