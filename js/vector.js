class Vector {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getNormalized() {
        const magnitude = this.getMagnitude();
        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    static fromRadians(radians) {
        return new Vector(Math.cos(radians), Math.sin(radians));
    }
}

export default Vector;
