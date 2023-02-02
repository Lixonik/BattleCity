import { gameManager } from "./battleCity.js";
import { mapManager } from "./battleCity.js";

export default class physicManager {
    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop";

        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        let ts = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2);
        if (obj.name === "rocket")
            ts = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y);
        let tsLeftDown, tsLeftUp, tsRightDown, tsRightUp;
        tsLeftDown = mapManager.getTilesetIdx(newX + obj.size_x / 16, newY + obj.size_y / 16);
        tsLeftUp = mapManager.getTilesetIdx(newX + obj.size_x / 16, newY + obj.size_y);
        tsRightDown = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y / 16);
        tsRightUp = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y);
        let e = this.entityAtXY(obj, newX, newY);

        if (e !== null && obj.onTouchEntity) { // объект
            obj.onTouchEntity(e)
        }

        if (ts !== 392 && obj.onTouchMap) { // препятствие   
            obj.onTouchMap(ts)
        }

        if (ts === 392  && e === null &&
            (obj.name.includes("rocket") || tsLeftDown !== 17 && tsRightUp !== 17 && tsLeftUp !== 17 && tsRightDown)) { // перемещаем объект на свободное место
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return "break"; // дальше нельзя
        }
        return "move"; // двигаемся
    }

    entityAtXY(obj, x, y) {
        for (let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y)
                    continue;
                return e;
            }
        }
        return null;
    }
}
