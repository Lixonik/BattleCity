import GameManager from "./GameManager.js";
import EventsManager from "./EventsManager.js";
import MapManager from "./MapManager.js";
import PhysicManager from "./PhysicManager.js";
import SpriteManager from "./SpriteManager.js";
import SoundsManager from "./SoundsManager.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let pathsToSounds = ["/sounds/themeSound.mp3", "/sounds/levelUpSound.mp3", 
                    "/sounds/bonusSound.mp3", "/sounds/damageSound.mp3",
                    "/sounds/killSound.mp3", "/sounds/gameOverSound.mp3",
                    "/sounds/winSound.mp3"
                ];

export let gameManager = new GameManager();
export let mapManager = new MapManager();
export let eventsManager = new EventsManager();
export let physicManager = new PhysicManager();
export let spriteManager = new SpriteManager();
export let soundsManager = new SoundsManager(...pathsToSounds);

gameManager.loadAll(ctx, ["./levels/map_1.json", "./levels/map_2.json"], "./assets/atlas.json", "./assets/sprites.png");

