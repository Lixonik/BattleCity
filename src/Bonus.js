import {spriteManager} from "./battleCity.js"
import Entity from "./Entity.js";

export default class Bonus extends Entity {
    constructor() {
        super();
        this.name = "bonus";
    }

    update() {}

    draw(ctx) {
        spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, 0, 0);
    }
}