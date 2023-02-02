import { spriteManager } from "./battleCity.js"
import { gameManager } from "./battleCity.js"
import { physicManager } from "./battleCity.js"
import Rocket from "./Rocket.js"
import Entity from "./Entity.js";


export default class Enemy extends Entity {
    constructor() {
        super();
        this.lifetime = 100;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 1;
        this.direction = -2;
        this.name = "enemy";
        this.justShot = false;
        this.shotInterval = null;
        setInterval(() => {
            let oldDirection = this.direction;
            while (this.direction === 0 || oldDirection === this.direction) {
                this.direction = Math.round(Math.random() * 4 - 2)
            }
            this.checkDirection();
        }, 3000)
    }

    draw(ctx) {
        let sprite_name;

        switch (this.direction) {
            case -1: sprite_name = "enemy_left"; break;
            case 1: sprite_name = "enemy_right"; break;
            case -2: sprite_name = "enemy_up"; break;
            case 2: sprite_name = "enemy_down"; break;
        }
        spriteManager.drawSprite(ctx, sprite_name, this.pos_x, this.pos_y, 0, 0);
    }

    onTouchEntity(obj) {
        if (obj.name.includes("player") || obj.name.includes("enemy")) {
            obj.kill();
        }
    }

    onTouchMap() {
        let oldDirection = this.direction;
        while (this.direction === 0 || oldDirection === this.direction) {
            this.direction = Math.round(Math.random() * 4 - 2);
        }
        this.checkDirection();
    }

    update() {

        let pX = gameManager.player.pos_x;
        let pY = gameManager.player.pos_y;

        if (Math.abs(this.pos_y - pY) <= 3 && (this.direction === -1 || this.direction === 1)) {
            if (this.direction === 1 && (pX - this.pos_x) / 16 <= 6 && (pX - this.pos_x) / 16 >= 0) {
                // перебрать клетки справа
                this.fire();
            }
            if (this.direction === -1 && (this.pos_x - pX) / 16 <= 6 && (this.pos_x - pX) / 16 >= 0) {
                // перебрать клетки слева
                this.fire();
            }
        }

        if (Math.abs(this.pos_x - pX) <= 3 && (this.direction === -2 || this.direction === 2)) {
            console.log(this.direction === -2, (this.pos_y - pY) / 16 <= 6, (this.pos_y - pY) / 16 >= 0)
            if (this.direction === -2 && (this.pos_y - pY) / 16 <= 6 && (this.pos_y - pY) / 16 >= 0) {
                // перебрать клетки сверху
                this.fire();
            }
            if (this.direction === 2 && (pY - this.pos_y) / 16 <= 6 && (pY - this.pos_y) / 16 >= 0) {
                // перебрать клетки снизу
                this.fire();
            }
        }


        physicManager.update(this);

    }

    fire() {
        if (this.justShot === false) {
            let r = new Rocket();
            r.size_x = 16;
            r.size_y = 16;
            r.name = "Enemy rocket" + (++gameManager.fireNum); // счётчик выстрелов
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
            }, 200);
        }
    }
}