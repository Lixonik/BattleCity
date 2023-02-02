import { mapManager } from "./battleCity.js"
import { spriteManager } from "./battleCity.js"
import { eventsManager } from "./battleCity.js"
import { soundsManager } from "./battleCity.js"


export default class GameManager {
    constructor() {
        this.entities = [];
        this.fireNum = 0;
        this.player = null;
        this.finish = null;
        this.laterKill = [];
        this.ctx = null;
        this.interval = null;
        this.levelNumber = 0;
        this.pathsToMaps = [];
        this.pointCount = 0;
        document.getElementById("username").innerHTML = "Игрок: " + localStorage.getItem('username');
    }

    loadAll(ctx, pathsToMaps, pathToAtlas, pathToImg) {
        this.ctx = ctx;
        this.pathsToMaps = pathsToMaps;
        mapManager.loadMap(this.pathsToMaps[0]);
        spriteManager.loadAtlas(pathToAtlas, pathToImg);
        mapManager.parseEntities();
        mapManager.draw(ctx);
        this.play();
    }

    initPlayer(obj) {
        this.player = obj;
    }

    initFinish(obj) {
        this.finish = obj;
    }

    pushEntity(obj) {
        this.entities.push(obj);
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    resetLevel() {
        this.levelNumber--;
        this.startNextLevel();
    }

    startNextLevel() {
        clearInterval(this.interval);
        soundsManager.stopThemeSound();
        this.levelNumber++;
        this.entities = [];
        this.fireNum = 0;
        this.player = null;
        this.finish = null;
        this.laterKill = [];
        mapManager.reset();
        mapManager.loadMap(this.pathsToMaps[this.levelNumber]);
        mapManager.parseEntities();
        this.ctx.clearRect(0, 0, mapManager.view.w, mapManager.view.h);
        mapManager.draw(this.ctx);
        this.play();
    }

    gameOver() {
        clearInterval(this.interval);
        mapManager.reset();
        this.entities = [];

        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.75;
        this.ctx.fillRect(0, mapManager.view.h / 2 - 30, mapManager.view.w, 60);
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Game Over', mapManager.view.w / 2, mapManager.view.h / 2);
        soundsManager.stopThemeSound();
        soundsManager.playGameOverSound();
        updateTable(localStorage.getItem('username'), this.pointCount);
        viewTable();
    }

    gameWin() {
        clearInterval(this.interval);
        mapManager.reset();
        this.entities = [];

        this.ctx.fillStyle = 'gray';
        this.ctx.globalAlpha = 0.75;
        this.ctx.fillRect(0, mapManager.view.h / 2 - 30, mapManager.view.w, 60);
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '36px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Win', mapManager.view.w / 2, mapManager.view.h / 2);
        soundsManager.stopThemeSound();
        soundsManager.playWinSound();
        updateTable(localStorage.getItem('username'), this.pointCount);
        viewTable();
    }

    update() {
        document.getElementById("level").innerHTML = "Уровень: " + (this.levelNumber + 1)
        // document.getElementById("pointCount").innerHTML = (this.pointCount)
        // console.log(this.laterKill)
        if (this.player === null)
            return;

        if (this.entities.indexOf(this.player) === -1) {
            this.gameOver();
        }

        if (this.finish.levelPassed && this.levelNumber < 1) {
            this.startNextLevel();
            soundsManager.playLevelUpSound();
        } else if (this.finish.levelPassed && this.levelNumber === 1) {
            this.gameWin();
        }
        this.player.setMoveX(0);
        this.player.setMoveY(0);
        if (eventsManager.action["up"]) this.player.setMoveY(-1);
        if (eventsManager.action["down"]) this.player.setMoveY(1);
        if (eventsManager.action["left"]) this.player.setMoveX(-1);
        if (eventsManager.action["right"]) this.player.setMoveX(1);
        if (eventsManager.action["esc"]) this.gameOver();
        if (eventsManager.action["reset"]) this.resetLevel();
        if (eventsManager.action["fire"]) this.player.fire();

        this.entities.forEach((e) => {
            try {
                e.update()
            } catch (ex) {
                console.log(e.name + " " + ex);
            }
        });

        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                this.entities.splice(idx, 1);
            }
        }

        if (this.laterKill.length > 0) {
            this.laterKill.length = 0;
        }

        mapManager.draw(this.ctx);
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(this.ctx);
    } 
    draw(ctx) {
        for (var e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx)
    }
    play() {
        soundsManager.playThemeSound();
        this.interval = setInterval(() => { this.update() }, 25);
    }
};