import NeuralNet from "./neuralnet/neuralNet.js";
import { InputNodes, HiddenNodes, OutputNodes, HiddenLayers } from "./constants.js";
import Vector from "./vector.js";
import Entity from "./entity.js";
import ParticleManager from "./particleManager.js";
import Bullet from "./bullet.js";
import { clamp } from "./utils.js";

class Enemy extends Entity {
    brain = null;
    size = new Vector(40, 40);
    vector = new Vector(0, 0);
    speed = 10;
    fitness = 0;
    elapsedTicksAtStart = 0;
    elapsedTicksFromStart = 0;
    dead = false;
    moveXFactor = 0;
    moveYFactor = 0;
    rotation = 0;
    shootCooldown = 50;
    lastShootTicks = 0;

    constructor(elapsedTicksAtStart, canvas) {
        super(100, "enemy");

        this.position = new Vector(
            (canvas.width / 2) - (this.size.x / 2),
            (canvas.height / 2) - (this.size.y / 2)
        );

        this.elapsedTicksAtStart = elapsedTicksAtStart;

        this.brain = new NeuralNet(InputNodes, HiddenNodes, OutputNodes, HiddenLayers);
    }

    update(elapsedTicks, canvas, player) {
        if (this.dead)
            return;

        this.elapsedTicksFromStart = elapsedTicks - this.elapsedTicksAtStart;

        this.fitness += 100;

        const distance = Math.sqrt(
            Math.pow(Math.abs(player.position.x - this.position.x), 2) +
            Math.pow(Math.abs(player.position.y - this.position.y), 2)
        );
        const bits = this.brain.output([
            this.elapsedTicksFromStart,
            this.elapsedTicksFromStart, //this.position.x + this.elapsedTicksFromStart,
            this.elapsedTicksFromStart, //this.position.y + this.elapsedTicksFromStart,
            this.elapsedTicksFromStart, //player.position.x + this.elapsedTicksFromStart,
            this.elapsedTicksFromStart, //player.position.y + this.elapsedTicksFromStart
        ]);
        // movement
        const max = 255;
        const firstBits = bits.slice(0, 8).join("");
        const secondBits = bits.slice(8, 16).join("");
        const firstByte = Number(parseInt(firstBits, 2).toString(10)) - (max / 2);
        const secondByte = Number(parseInt(secondBits, 2).toString(10)) - (max / 2);
        this.moveXFactor = 2 * (firstByte / max);
        this.moveYFactor = 2 * (secondByte / max);

        const newPositionX = this.position.x + (this.speed * this.moveXFactor);
        const newPositionY = this.position.y + (this.speed * this.moveYFactor);

        if (
            newPositionX >= 0 &&
            newPositionY >= 0 &&
            newPositionX + this.size.x <= canvas.width &&
            newPositionY + this.size.y <= canvas.height
        ) {
            this.position.x = newPositionX;
            this.position.y = newPositionY;
            this.fitness += 1000;
        } else {
            this.fitness -= 10000;
        }

        if (this.collidesWith(player))
            this.damagePlayer(player, 1);

        const rotationBits = bits.slice(16, 32).join("");
        const rotationUShort = Number(parseInt(rotationBits, 2).toString(10));
        const rotationMax = 65535;
        const degreeMax = 360;
        const rotationPercentage = rotationUShort / 65535;
        const degrees = degreeMax * rotationPercentage;
        this.rotation = degrees * 180 / Math.PI;

        const willShoot = bits[bits.length - 1] === 1;

        if (willShoot)
            this.shoot(elapsedTicks);
    }

    collidesWith(player) {
        const collides = ((
            this.position.x + this.size.x >= player.position.x &&
            this.position.y + this.size.y >= player.position.y &&
            this.position.x + this.size.x <= player.position.x + player.size.x &&
            this.position.y + this.size.y <= player.position.y + player.size.y
        ));

        return collides;
    }

    damagePlayer(player, damage) {
        this.fitness += damage * 2500;

        console.log("damage player", player, damage);
        player.damage(damage);
    }

    draw(canvas, context) {
        if (this.dead)
            return;

        context.save();
        context.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        context.rotate(this.rotation);
        context.fillStyle = "purple";
        //context.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.drawImage(document.getElementById("kirka"), -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.restore();

        context.fillStyle = "red";
        context.strokeStyle = "black";
        const healthPercentage = this.health / this.maxHealth;
        const healthBarHeight = 16;
        const healthBarWidth = 100;
        const healthBarLength = healthBarWidth * healthPercentage;
        const healthBarXPosition = clamp(
            this.position.x + (this.size.x / 2) - (healthBarWidth / 2),
            10,
            canvas.width - healthBarWidth - 10
        );
        const healthBarYPosition = clamp(
            this.position.y - (healthBarHeight) - 10,
            10,
            canvas.height
        );
        context.fillRect(healthBarXPosition, healthBarYPosition, healthBarLength, healthBarHeight);
        context.strokeRect(healthBarXPosition, healthBarYPosition, healthBarWidth, healthBarHeight);
    }

    shoot(elapsedTicks) {
        if (elapsedTicks - this.lastShootTicks >= this.shootCooldown) {
            this.lastShootTicks = elapsedTicks;
            ParticleManager.add(new Bullet(
                this,
                this.position.clone(),
                Vector.fromRadians(this.rotation),
                this.rotation
            ));
        }
    }

    crossover(other, elapsedTicks, canvas) {
        const result = new Enemy(elapsedTicks, canvas);
        result.brain = this.brain.crossover(other.brain);
        return result;
    }

    mutate() {
        this.brain.mutate();
    }

    initialize() {
        this.brain.initialize();
    }
}

export default Enemy;