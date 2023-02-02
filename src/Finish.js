import Entity from "./Entity.js";
import { spriteManager } from "./battleCity.js";


export default class Finish extends Entity {
    constructor() {
        super();
        this.name = "finish";
        this.levelPassed = false;
    }

    update() {}

    draw(ctx) {
        spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, 0, 0);
    }
};