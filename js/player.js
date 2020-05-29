import Vector from "./vector.js";

class Player {
    position = new Vector(0, 0);
    vector = new Vector(0, 0);
    size = new Vector(20, 20);
    speed = 5;

    constructor(initialPosition) {
        this.position = initialPosition;

        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    onKeyDown(keyEvent) {
        switch (keyEvent.key) {
            case "w":
                this.vector.y = -1;
                break;
            case "s":
                this.vector.y = 1;
                break;
            case "a":
                this.vector.x = -1;
                break;
            case "d":
                this.vector.x = 1;
                break;
        }
    }

    onKeyUp(keyEvent) {
        switch (keyEvent.key) {
            case "w":
                this.vector.y = 0;
                break;
            case "s":
                this.vector.y = 0;
                break;
            case "a":
                this.vector.x = 0;
                break;
            case "d":
                this.vector.x = 0;
                break;
        }
    }

    update() {
        this.position.x += this.vector.x;
        this.position.y += this.vector.y;
    }

    draw(context) {
        context.fillStyle = "white";
        context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

export default Player;
