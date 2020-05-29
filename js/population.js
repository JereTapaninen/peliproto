import Enemy from "./enemy.js";

class Population {
    size = 0;
    generation = 0;
    entityIndex = 0;
    entities = [];

    constructor(size) {
        this.size = size;
        this.entities = new Array(size);
    }

    doCrossovers(elapsedTicks) {
        this.generation++;
        this.entityIndex = 0;

        let currentBestFitness = 0;
        let bestEntityIndex = 0;

        for (let i = 0; i < this.entities.length; i++) {
            let fitness = this.entities[i].fitness;

            if (fitness > currentBestFitness) {
                bestEntityIndex = i;
                currentBestFitness = fitness;
            }
        }

        const bestEntity = this.entities[bestEntityIndex];
        const entitiesWithoutBest = this.entities.filter((_, i) => i !== bestEntityIndex);
        const newPopulation = new Array(this.entities.length);
        const bestEntityClone = bestEntity.crossover(bestEntity);
        newPopulation[0] = bestEntityClone;

        for (let i = 0; i < entitiesWithoutBest.length; i++) {
            newPopulation[i + 1] = i + 1 < entitiesWithoutBest.length ?
                entitiesWithoutBest[i].crossover(entitiesWithoutBest[i + 1]) :
                entitiesWithoutBest[i].crossover(bestEntity);
            newPopulation[i + 1].mutate();
        }

        this.entities = newPopulation;
    }

    runSingleEnemy(elapsedTicks) {
        //console.log("i get called", this.entityIndex);
        this.entityIndex++;

        if (this.entityIndex >= this.size)
            this.doCrossovers(elapsedTicks);
    }

    update(elapsedTicks, canvas, player) {
        this.entities[this.entityIndex].update(elapsedTicks, canvas, player);
    }

    draw(context) {
        this.entities[this.entityIndex].draw(context);
    }

    initialize(elapsedTicks) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i] = new Enemy(elapsedTicks);
            this.entities[i].initialize();
        }
    }
}

export default Population;
