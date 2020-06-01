class Entity {
    constructor(health, type) {
        this.maxHealth = health;
        this.health = health;
        this.type = type;
        this.dead = false;
    }

    damage(health) {
        this.health -= health;

        if (this.health <= 0)
            this.dead = true;
    }
}

export default Entity;
