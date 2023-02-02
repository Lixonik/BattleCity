import { soundsManager } from "./battleCity.js"
import { spriteManager } from "./battleCity.js"
import { gameManager } from "./battleCity.js"
import { physicManager } from "./battleCity.js"

import Entity from "./Entity.js";
import Rocket from "./Rocket.js";


export default class Player extends Entity {
    constructor() {
        super();
        this.lifetime = 100;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 2;
        this.direction = -2;
        this.name = "player";
        this.justShot = false;
        this.shotInterval = null;
    }

    draw(ctx) {
        let sprite_name;

        switch (this.direction) {
            case -1: sprite_name = "player_left"; break;
            case 1: sprite_name = "player_right"; break;
            case -2: sprite_name = "player_up"; break;
            case 2: sprite_name = "player_down"; break;
        }

        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    }

    update() {
        if (this.move_x === -1) {
            this.direction = -1;
        }
        if (this.move_x === 1) {
            this.direction = 1;
        }
        if (this.move_y === -1) {
            this.direction = -2;
        }
        if (this.move_y === 1) {
            this.direction = 2;
        }
        physicManager.update(this);

    }

    fire() {
        if (this.justShot === false) {
            let r = new Rocket();
            r.size_x = 16;
            r.size_y = 16;
            r.name = "Player rocket" + (++gameManager.fireNum); // счётчик выстрелов
            r.direction = this.direction;

            switch (r.direction) {
                case -1: // left
                    r.pos_x = this.pos_x - r.size_x;
                    r.pos_y = this.pos_y;
                    break;
                case 1: // right
                    r.pos_x = this.pos_x + r.size_x;
                    r.pos_y = this.pos_y;
                    break;
                case -2: //up
                    r.pos_x = this.pos_x;
                    r.pos_y = this.pos_y - r.size_y;
                    break;
                case 2: // down
                    r.pos_x = this.pos_x;
                    r.pos_y = this.pos_y + r.size_y;
                    break;
                default:
                    return;
            }
            gameManager.entities.push(r);
            this.justShot = true;
            this.shotInterval = setInterval(() => {
                this.justShot = false;
                clearInterval(this.shotInterval);
            }, 1000);
        }
    }

    onTouchEntity(obj) {
        if (obj.name.match(/bonus/)) {
            this.lifetime += 50;
            obj.kill();
            soundsManager.playBonusSound();
            gameManager.pointCount += 50;
        }

        if (obj.name.includes("finish")) {
            obj.levelPassed = true;
        }
    }
}