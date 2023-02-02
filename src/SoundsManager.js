export default class EventsManager {
    constructor(pathTothemeSound, pathTolevelUpSound,
        pathToBonusSound, pathToDamageSound,
        pathToKillSound, pathToGameOverSound, 
        pathToWinSound) {
        this.themeSound = new Audio(pathTothemeSound);
        this.levelUpSound = new Audio(pathTolevelUpSound);
        this.bonusSound = new Audio(pathToBonusSound);
        this.damageSound = new Audio(pathToDamageSound);
        this.killSound = new Audio(pathToKillSound);
        this.gameOverSound = new Audio(pathToGameOverSound);
        this.winSound = new Audio(pathToWinSound);
    }

    playThemeSound() {
        this.themeSound.play();
    }

    stopThemeSound() {
        this.themeSound.pause();
        this.themeSound.currentTime = 0;
    }

    playLevelUpSound() {
        this.levelUpSound.play();
    }
    
    playBonusSound() {
        this.bonusSound.play();
    }

    playDamageSound() {
        this.damageSound.play();
    }

    playKillSound() {
        this.killSound.play();
    }

    playGameOverSound() {
        this.gameOverSound.play();
    }

    playWinSound() {
        this.winSound.play();
    }
};