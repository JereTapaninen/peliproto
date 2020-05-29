import Vector from "./vector.js";

class Ball {
    position = new Vector(0, 0);
    vector = new Vector(0, 0);
    frequency = 0;
    radius = 10;
    destroyMe = false;

    constructor(initialPosition, vector, frequency) {
        this.position = initialPosition;
        this.vector = vector;
        this.frequency = frequency;
    }

    update(canvas) {
        if (this.destroyMe)
            return;

        this.position = new Vector(
            this.position.x + this.vector.x,
            this.position.y + this.vector.y
        );

        const isOutOfBounds = (
            (this.position.x < 0 && this.vector.x < 0) || // is going to the left and is outside
            (this.position.y < 0 && this.vector.y < 0) || // is going up and is outside
            (this.position.x > canvas.width && this.vector.x > 0) || // is going to the right and is outside
            (this.position.y > canvas.height && this.vector.y > 0) // is going down and is outside
        );

        if (isOutOfBounds) {
            this.destroyMe = true;
        }
    }

    draw(canvas, context) {
        context.fillStyle = `rgb(${this.frequency}, ${this.frequency}, ${this.frequency})`;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}

export default Ball;
