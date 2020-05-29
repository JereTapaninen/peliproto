import NeuralNet from "./neuralnet/neuralNet.js";
import { InputNodes, HiddenNodes, OutputNodes, HiddenLayers } from "./constants.js";
import Vector from "./vector.js";

class Enemy {
    brain = null;
    position = new Vector(0, 0);
    size = new Vector(20, 40);
    vector = new Vector(0, 0);
    speed = 10;
    fitness = 0;
    elapsedTicksAtStart = 0;
    elapsedTicksFromStart = 0;
    dead = false;
    moveXFactor = 0;
    moveYFactor = 0;

    constructor(elapsedTicksAtStart) {
        this.elapsedTicksAtStart = elapsedTicksAtStart;

        this.brain = new NeuralNet(InputNodes, HiddenNodes, OutputNodes, HiddenLayers);
    }

    update(elapsedTicks, canvas, player) {
        if (this.dead)
            return;

        this.elapsedTicksFromStart = elapsedTicks - this.elapsedTicksAtStart;

        this.fitness = this.elapsedTicksFromStart;

        if (elapsedTicks % 1 === 0) {
            const distance = Math.sqrt(
                Math.pow(Math.abs(player.position.x - this.position.x), 2) +
                Math.pow(Math.abs(player.position.y - this.position.y), 2)
            );
            const bits =
                this.brain.output([
                    distance,
                    this.position.x,
                    this.position.y,
                    player.position.x,
                    player.position.y
                ]);
            const max = 255;
            const firstBits = bits.slice(0, 8).map(val => val.toString()).join("");
            const secondBits = bits.slice(8, 16).map(val => val.toString()).join("");
            //console.log("first bits", firstBits, "second bits", secondBits);
            const firstByte = Number(parseInt(firstBits, 2).toString(10)) - (max / 2);
            const secondByte = Number(parseInt(secondBits, 2).toString(10)) - (max / 2);
            //console.log("bits", bits, "first byte", firstByte, "second byte", secondByte);
            this.moveXFactor = 2 * (firstByte / max);
            this.moveYFactor = 2 * (secondByte / max);
            // console.log(this.moveXFactor, this.moveYFactor);
            //console.log(this.moveXFactor, this.moveYFactor)
        }

        const newPositionX = this.position.x + (this.speed * this.moveXFactor);
        const newPositionY = this.position.y + (this.speed * this.moveXFactor);

        if (
            newPositionX >= 0 &&
            newPositionY >= 0 &&
            newPositionX + this.size.x <= canvas.width &&
            newPositionY + this.size.y <= canvas.height
        ) {
            this.position.x = newPositionX;
            this.position.y = newPositionY;
        }
    }

    draw(context) {
        if (this.dead)
            return;

        context.fillStyle = "purple";
        context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    crossover(other, elapsedTicks) {
        const result = new Enemy();
        result.elapsedTicksAtStart = elapsedTicks;
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