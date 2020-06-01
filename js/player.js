import Vector from "./vector.js";
import ParticleManager from "./particleManager.js";
import Bullet from "./bullet.js";
import Entity from "./entity.js";

class Player extends Entity {
    position = new Vector(0, 0);
    size = new Vector(30, 30);
    speed = 5;
    rotation = 0;
    shootCooldown = 25;
    lastShootTicks = 0;

    inputManager = null;

    fromCenterToMouse = new Vector(0, 0);

    constructor(initialPosition, inputManager) {
        super(100, "player");

        this.position = initialPosition;
        this.inputManager = inputManager;

        this.inputManager.bindActionToKeyPress("q", this.shoot.bind(this));
    }

    shoot() {
        if (window.state.elapsedTicks - this.lastShootTicks >= this.shootCooldown) {
            this.lastShootTicks = window.state.elapsedTicks;

            ParticleManager.add(new Bullet(
                this,
                this.position.clone(),
                this.fromCenterToMouse.getNormalized(),
                this.rotation
            ));
        }
    }

    damage(damage) {
        super.damage(25);

        if (this.health <= 0)
            this.health = this.maxHealth;
    }

    update(canvas) {
        let moveXFactor = 0;
        let moveYFactor = 0;

        if (this.inputManager.keyDown("w"))
            moveYFactor -= 1;

        if (this.inputManager.keyDown("s"))
            moveYFactor += 1;

        if (this.inputManager.keyDown("a"))
            moveXFactor -= 1;

        if (this.inputManager.keyDown("d"))
            moveXFactor += 1;

        const multiplier = this.inputManager.keyDown("shift") ? 2 : 1;

        const newPositionX = this.position.x + ((moveXFactor * this.speed) * multiplier);
        const newPositionY = this.position.y + ((moveYFactor * this.speed) * multiplier);

        if (
            newPositionX > 0 &&
            newPositionY > 0 &&
            newPositionX + this.size.x < canvas.width &&
            newPositionY + this.size.y < canvas.height
        ) {
            this.position.x = newPositionX;
            this.position.y = newPositionY;
        }

        // calculate rotation
        const playerCenter = new Vector(
            this.position.x + this.size.x / 2,
            this.position.y + this.size.y / 2
        );

        this.fromCenterToMouse = new Vector(
            playerCenter.x - this.inputManager.mousePosition.x,
            playerCenter.y - this.inputManager.mousePosition.y
        );

        this.rotation = Math.atan2(
            this.fromCenterToMouse.x,
            -this.fromCenterToMouse.y
        );
    }

    draw(context) {
        context.save();
        context.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        context.rotate(this.rotation);
        context.fillStyle = "white";
        //context.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.drawImage(document.getElementById("bomfunk"), -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.restore();
    }
}

export default Player;
