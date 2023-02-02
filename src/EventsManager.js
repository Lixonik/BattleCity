export default class EventsManager {
    constructor() {
        this.bind = [],
        this.action = []
        this.bind["Escape"]="esc";
        this.bind["ArrowUp"]="up";
        this.bind["ArrowLeft"]="left";
        this.bind["ArrowDown"]="down";
        this.bind["ArrowRight"]="right";
        this.bind["Backspace"]="reset";
        this.bind[" "]="fire";
        document.body.addEventListener("keydown", (event) => {this.onKeyDown(event)});
        document.body.addEventListener("keyup", (event) => {this.onKeyUp(event)});
    }

    onKeyDown(event) {
        let action = this.bind[event.key];
        if(action) {
            this.action[action] = true;
            // event.preventDefault();
        }
    }

    onKeyUp(event) {
        let action = this.bind[event.key];
        if(action)
            this.action[action] = false;
    }
}