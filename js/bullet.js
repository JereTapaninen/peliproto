import Particle from "./particle.js";
import Vector from "./vector.js";

class Bullet extends Particle {
    owner = null;
    position = new Vector(0, 0);
    vector = new Vector(0, 0);
    size = new Vector(10, 10);
    rotation = 0;
    speed = 5;
    damage = 25;

    constructor(owner, initialPosition, vector, rotation) {
        super();
        this.owner = owner;
        this.position = initialPosition;
        this.vector = vector;

        if (rotation === undefined) {
            this.rotation = Math.atan2(
                this.vector.x,
                -this.vector.y
            );
        } else {
            this.rotation = rotation;
        }
    }

    update(canvas, entities) {
        this.position.x += this.speed * -this.vector.x;
        this.position.y += this.speed * -this.vector.y;

        const entitiesNoOwner = entities
            .filter(entity => entity.type !== this.owner.type && entity.dead !== true);
        const collidesWithEntity = entitiesNoOwner
            .find(entity => this.collidesWith(entity));

        if (collidesWithEntity !== undefined) {
            console.log(collidesWithEntity);
            this.destroyMe = true;
            if (this.owner.type === "player")
                collidesWithEntity.damage(this.damage);
            else if (this.owner.type === "enemy" && collidesWithEntity.type === "player")
                this.owner.damagePlayer(collidesWithEntity, this.damage);
        }

        if (
            this.position.x < 0 ||
            this.position.y < 0 ||
            this.position.x + this.size.x > canvas.width ||
            this.position.y + this.size.y > canvas.height
        ) {
            this.destroyMe = true;
        }

        if (this.owner.dead)
            this.destroyMe = true;
    }

    collidesWith(entity) {
        const collides = ((
            this.position.x + this.size.x >= entity.position.x &&
            this.position.y + this.size.y >= entity.position.y &&
            this.position.x + this.size.x <= entity.position.x + entity.size.x &&
            this.position.y + this.size.y <= entity.position.y + entity.size.y
        ));

        if (collides)
            console.log("yes, collides");

        return collides;
    }

    draw(context) {
        context.save();
        context.translate(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        context.rotate(this.rotation);
        context.fillStyle = this.owner.type === "player" ?
            "green" :
            "orange";
        context.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.restore();
    }
}

export default Bullet;
