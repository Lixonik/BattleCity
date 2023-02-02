import {gameManager} from "./battleCity.js";


export default class Entity {
    constructor() {
        this.pos_x = 0;
        this.pos_y = 0;
        this.size_x = 0;
        this.size_y = 0;
        this.name = "entity";
    }

    setMoveX(value) {
        this.move_x = value;
    }

    setMoveY(value) {
        this.move_y = value;
    }

    kill() {
        gameManager.laterKill.push(this);
    }

    checkDirection() {
        switch (this.direction) {
            case -1: this.move_x = -1; this.move_y = 0; break;
            case 1: this.move_x = 1; this.move_y = 0; break;
            case -2: this.move_y = -1; this.move_x = 0; break;
            case 2: this.move_y = 1; this.move_x = 0; break;
        }
    }
}
