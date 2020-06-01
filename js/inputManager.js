import Vector from "./vector.js";
import { clamp } from "./utils.js";

class InputManager {
    _keysDown = [];
    _keyPressHandlers = {};
    _mousePosition = new Vector(0, 0);

    get mousePosition() {
        return this._mousePosition;
    }

    constructor(canvas) {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
        window.addEventListener("keypress", this.onKeyPress.bind(this));
        window.addEventListener(
            "mousemove",
            function(mouseEvent) {
                this.onMouseMove(mouseEvent, canvas);
            }.bind(this)
        );
    }

    onMouseMove(mouseEvent, canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = clamp(mouseEvent.pageX - rect.left, 0, canvas.width);
        const mouseY = clamp(mouseEvent.pageY - rect.top, 0, canvas.height);
        //console.log(mouseX, mouseY);
        this._mousePosition = new Vector(mouseX, mouseY);
    }

    onKeyPress(keyEvent) {
        const keyToCheck = keyEvent.key.toLowerCase();

        if (Object.keys(this._keyPressHandlers).includes(keyToCheck)) {
            const allHandlers = this._keyPressHandlers[keyToCheck];
            allHandlers.forEach(handler => {
                handler();
            });
        }
    }

    onKeyDown(keyEvent) {
        const keyToAdd = keyEvent.key.toLowerCase();

        console.log(keyToAdd);

        if (!this._keysDown.includes(keyToAdd))
            this._keysDown.push(keyToAdd);
    }

    onKeyUp(keyEvent) {
        const keyToRemove = keyEvent.key.toLowerCase();

        this._keysDown = this._keysDown.filter(key => key !== keyToRemove);
    }

    bindActionToKeyPress(key, action) {
        const keyToAdd = key.toLowerCase();

        if (Object.keys(this._keyPressHandlers).includes(keyToAdd)) {
            this._keyPressHandlers[keyToAdd].push(action);
        } else {
            this._keyPressHandlers[keyToAdd] = [action];
        }
    }

    keyDown(key) {
        return this._keysDown.includes(key.toLowerCase());
    }

    keyUp(key) {
        return !this._keysDown.includes(key.toLowerCase());
    }
}

export default InputManager;
