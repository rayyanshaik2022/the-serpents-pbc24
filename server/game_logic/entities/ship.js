const config = require("../config.js");
const helpers = require("../helpers.js");

class Ship {
    constructor () {
        this.position = helpers.GEN_SPAWN_LOC;
        this.velocity = [0, 0];
        
        this.tokens = []
        this.cannon_balls = []
    }

    update () {
        const velocity = () => {
            if (this.position[0] + this.velocity[1] > config.MAP_SIZE) { 
                this.position[0] = config.MAP_SIZE;
            } else if (this.position[0] + this.velocity[0] < config.MAP_SIZE) {
                this.position[0] = 0;
            }

            if (this.position[1] + this.velocity[1] > config.MAP_SIZE) {
                this.position[1] = config.MAP_SIZE;
            } else if (this.position[1] + this.velocity[1] < config.MAP_SIZE) {
                this.position[1] = config.MAP_SIZE;
            }
        }

        velocity();
    }
}

module.exports = Ship;