import Bonus from "./Bonus.js";
import Player from "./Player.js";
import Rocket from "./Rocket.js";
import { gameManager } from "./battleCity.js";
import Enemy from "./Enemy.js";
import Finish from "./Finish.js"

export default class MapManager {
    constructor() {
        this.mapData = null;
        this.tLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = { x: 16, y: 16 };
        this.mapSize = { x: 16, y: 16 };
        this.tilesets = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.view = { x: 0, y: 0, w: 512, h: 512 };
        this.moving_map = false;
        this.success = false;
    }

    loadMap(path) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseMap(request.responseText)
            }
        };
        request.open("GET", path, true);
        request.send()
    }

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        if (this.mapSize.x > this.view.w || this.mapSize.y > this.view.h) this.moving_map = true;

        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image();
            img.onload = () => {
                this.imgLoadCount++;
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y),
            };
            this.tilesets.push(ts)
        }
        this.jsonLoaded = true;
    }

    draw(ctx) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.draw(ctx);
            }, 100);
        } else {
            if (this.tLayer === null) {
                for (let id = 0; id < this.mapData.layers.length; id++) {
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        if (layer.name === "my_tiles") {
                            this.tLayer = layer;
                            continue;
                        }
                    }

                }
            }
            for (let i = 0; i < this.tLayer.data.length; i++) {
                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
            this.success = true;
        }
    }

    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0,
            py: 0
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;

        return tile;
    }

    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--)
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        return null;
    }

    isVisible(x, y, width, height) {
        if (x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    }

    parseEntities() {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.parseEntities();
            }, 100)
        } else {
            for (let j = 0; j < this.mapData.layers.length; j++)
                if (this.mapData.layers[j].type === 'objectgroup') {
                    let entities = this.mapData.layers[j];
                    for (let i = 0; i < entities.objects.length; i++) {
                        let e = entities.objects[i];

                        try {
                            let obj;
                            switch (e.class) {
                                case "Player":
                                    obj = new Player();
                                    break;
                                case "Enemy":
                                    obj = new Enemy();
                                    break;
                                case "Bonus":
                                    obj = new Bonus();
                                    break;
                                case "Rocket":
                                    obj = new Rocket();
                                    break;
                                case "Finish":
                                    obj = new Finish();
                                    break;
                            }
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            gameManager.pushEntity(obj);
                            if (e.class === "Player") {
                                gameManager.initPlayer(obj);
                                console.log("YES")
                            } else if (e.class === "Finish") {
                                gameManager.initFinish(obj);
                            }
                        } catch (ex) {
                            console.log("Ошибка создания: [" + e.gid + "] " + e.class + ", " + ex)
                        }
                    }
                }
        }
    }


    getTilesetIdx(x, y) {
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);

        return this.tLayer.data[idx]
    }

    centerAt(x, y) {
        if (!this.moving_map) return;
        if (x < this.view.w / 2)
            this.view.x = 0;
        else
            if (x > this.mapSize.x - this.view.w / 2)
                this.view.x = this.mapSize.x - this.view.w;
            else
                this.view.x = x - (this.view.w / 2)
        if (y < this.view.h / 2)
            this.view.y = 0;
        else
            if (y > this.mapSize.y - this.view.h / 2)
                this.view.y = this.mapSize.y - this.view.h;
            else
                this.view.y = y - (this.view.h / 2)
    }

    success() {
        return this.success;
    }

    reset() {
        this.mapData = null;
        this.tLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = { x: 16, y: 16 };
        this.mapSize = { x: 16, y: 16 };
        this.tilesets = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.view = { x: 0, y: 0, w: 512, h: 512 };
        this.moving_map = false
    }
}