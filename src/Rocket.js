import Entity from "./Entity.js";
import { gameManager, soundsManager } from "./battleCity.js"
import { spriteManager } from "./battleCity.js"
import { physicManager } from "./battleCity.js"

export default class Rocket extends Entity {
    constructor() {
        super();
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 4;
        this.direction = 0;
        this.name = "rocket";
        this.damage = 25;
    }

    draw(ctx) {
        let sprite_name;

        this.checkDirection();

        switch (this.direction) {
            case -1: sprite_name = "rocket_left"; break;
            case 1: sprite_name = "rocket_right"; break;
            case -2: sprite_name = "rocket_up"; break;
            case 2: sprite_name = "rocket_down"; break;
        }


        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    }

    update() {

        this.checkDirection();
        physicManager.update(this);

    }

    onTouchEntity(obj) {
        if (obj.name.match(/enemy/) || obj.name.match(/player/)) {
            if (obj.lifetime - this.damage <= 0) {
                obj.lifetime -= this.damage;
                obj.kill();
                if (obj.name.match(/enemy/)) {
                    soundsManager.playKillSound();
                    gameManager.pointCount += 100;
                }
            }
            else {
                obj.lifetime -= this.damage;
                soundsManager.playDamageSound();
            }
        }
        this.kill();
    }

    onTouchMap(idx) {
        this.kill();
    }
}