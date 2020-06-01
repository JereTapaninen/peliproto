import Enemy from "./enemy.js";
import Player from "./player.js";
import Vector from "./vector.js";
import ParticleManager from "./particleManager.js";
import Overlay from "./overlay.js";

class Population {
    size = 0;
    generation = 0;
    entityIndex = 0;
    entities = [];

    lastAvgFrequency = 0;

    player = null;
    inputManager = null;

    constructor(size, inputManager, canvas) {
        this.inputManager = inputManager;
        this.size = size;
        this.entities = new Array(size);
        this.player = new Player(new Vector(100, 100), inputManager);

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i] = new Enemy(0, canvas);
            this.entities[i].initialize();
        }
    }

    doCrossovers(elapsedTicks, canvas) {
        this.generation++;
        this.entityIndex = 0;

        const sortedEntities = [...this.entities].sort((a, b) => b.fitness > a.fitness ? 1 : -1);
        const newPopulation = new Array(sortedEntities.length);

        if (sortedEntities.length % 2 === 0) {
            const worstRemoved = sortedEntities.slice(0, sortedEntities.length / 2);
            for (let i = 0; i < worstRemoved.length; i++) {
                newPopulation[i] = worstRemoved[i].crossover(worstRemoved[i], elapsedTicks, canvas);
                newPopulation[i + (sortedEntities.length / 2)] = i + 1 < worstRemoved.length ?
                    worstRemoved[i].crossover(worstRemoved[i + 1], elapsedTicks, canvas) :
                    worstRemoved[i].crossover(worstRemoved[0], elapsedTicks, canvas);
                newPopulation[i].mutate();
                newPopulation[i + (sortedEntities.length / 2)].mutate();
            }
        }

        console.log("new pop", newPopulation);
        this.entities = newPopulation;

        //console.log("saas sees", sortedEntities);
        //this.entities = sortedEntities;

        /*let currentBestFitness = -1000000000;
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
        const bestEntityClone = bestEntity.crossover(bestEntity, elapsedTicks, canvas);
        newPopulation[0] = bestEntityClone;

        for (let i = 0; i < entitiesWithoutBest.length; i++) {
            newPopulation[i + 1] = i + 1 < entitiesWithoutBest.length ?
                entitiesWithoutBest[i].crossover(entitiesWithoutBest[i + 1], elapsedTicks, canvas) :
                entitiesWithoutBest[i].crossover(bestEntity, elapsedTicks, canvas);
            newPopulation[i + 1].mutate();
        }*/

        //this.entities = newPopulation;
    }

    runSingleEnemy(elapsedTicks, canvas) {
        this.entityIndex++;

        if (this.entityIndex >= this.size)
            this.doCrossovers(elapsedTicks, canvas);
    }

    update(elapsedTicks, canvas, songInfo) {
        if (songInfo !== null) {
            const dataArray = new Uint8Array(songInfo.analyser.frequencyBinCount);
            songInfo.analyser.getByteTimeDomainData(dataArray);
            this.lastAvgTimeDomain = [...dataArray]
                .reduce((acc, curr) => acc + curr) / dataArray.length;

            const freqData = new Uint8Array(songInfo.analyser.frequencyBinCount);
            songInfo.analyser.getByteFrequencyData(freqData);
            this.lastAvgFrequency = [...freqData]
                .reduce((acc, curr) => acc + curr) / freqData.length;
        }

        ParticleManager.update(canvas, this.entities.concat(this.player));

        if (this.entities[this.entityIndex].dead) {
            this.runSingleEnemy(elapsedTicks, canvas);
            console.log("entity dead");
        }

        this.entities[this.entityIndex].update(elapsedTicks, canvas, this.player);
        this.player.update(canvas);
    }

    draw(canvas, context) {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        //context.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        const rounded = this.lastAvgFrequency / 255;
        context.fillStyle = `rgba(255, 0, 0, ${rounded.toFixed("2")})`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        ParticleManager.draw(context);

        this.entities[this.entityIndex].draw(canvas, context);
        this.player.draw(context);

        Overlay.draw(canvas, context, this.player);

        context.fillStyle = "yellow";
        context.font = "24px 'Press Start 2P'";
        context.fillText(
            `World ${this.generation + 1}, level ${this.entityIndex + 1}`,
            10, 42
        );
    }
}

export default Population;
