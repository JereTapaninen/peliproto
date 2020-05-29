import Population from "../population.js";
import Player from "../player.js";
import Vector from "../vector.js";

class Level {
    songId = "";
    analyser = null;
    seed = -1;

    lastAvgFrequency = 0;
    lastAvgTimeDomain = 0;

    population = null;
    player = null;

    constructor(songId, analyser, seed, elapsedTicks) {
        this.songId = songId;
        this.analyser = analyser;
        this.seed = seed;

        this.population = new Population(5);
        this.population.initialize(elapsedTicks);

        this.player = new Player(new Vector(100, 100));
    }

    update(canvas, elapsedTicks) {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(dataArray);
        this.lastAvgTimeDomain = [...dataArray]
            .reduce((acc, curr) => acc + curr) / dataArray.length;

        const freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(freqData);
        this.lastAvgFrequency = [...freqData]
            .reduce((acc, curr) => acc + curr) / freqData.length;

        if (this.population.entities[this.population.entityIndex].dead) {
            this.population.runSingleEnemy(elapsedTicks);
        }

        this.population.update(elapsedTicks, canvas, this.player);
        this.player.update();
    }

    draw(canvas, context) {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        //context.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        const rounded = this.lastAvgFrequency / 255;
        context.fillStyle = `rgba(255, 0, 0, ${rounded.toFixed("2")})`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        this.population.draw(context);
        this.player.draw(context);

        context.fillStyle = "yellow";
        context.font = "32px Tahoma";
        context.fillText(
            `World ${this.population.generation}, level ${this.population.entityIndex + 1}`,
            10, 42
        );

        //this.balls.forEach(ball => ball.draw(canvas, context));

        //this.player.draw(context);
    }
}

export default Level;


/*import Ball from "../ball.js";
import { collectionToArray } from "../utils.js";
import Vector from "../vector.js";
import Player from "../player.js";

class Level {
    songId = "";
    image = null;
    balls = [];
    analyser = null;
    blockSize = 10;
    lastAvgFrequency = 0;
    lastAvgTimeDomain = 0;
    seed = -1;
    generalTrend = 10;
    player = null;

    constructor(songId, analyser, seed) {
        this.songId = songId;
        this.image = collectionToArray(document
            .getElementById("images")
            .getElementsByTagName("img")
        ).find(element => element.id === songId + "-image");
        this.analyser = analyser;
        this.seed = seed;
        this.player = new Player(new Vector(0, 0));
    }

    update(canvas) {
        this.player.update();

        for (const ball of this.balls) {
            ball.update(canvas);
        }
        /*for (const ball of this.balls) {
            if (ball.destroyMe)
                this.balls.splice(this.balls.indexOf(ball), 1);
        }*//*
        this.balls = this.balls.filter(ball => !ball.destroyMe);
        this.blockSize = Math.round(30 - (10 * (this.lastAvgFrequency / 256)));
        this.analyser.fftSize = this.lastAvgFrequency > 227 ?
            64 :
            32;

        let dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(dataArray);
        this.lastAvgTimeDomain = [...dataArray].reduce((acc, curr) => acc + curr) / dataArray.length;
        dataArray = this.parseData(dataArray);

        let freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(freqData);
        this.lastAvgFrequency = [...freqData].reduce((acc, curr) => acc + curr) / freqData.length;
        freqData = this.parseData(freqData);

        let wall1 = [];
        let wall2 = [];
        let wall3 = [];
        let wall4 = [];
        let randomResult = -1;

        if (dataArray.length < 4) {
            randomResult = this.getRandom(0, 4);

            switch (randomResult) {
                case 1:
                    wall2 = dataArray;
                    break;
                case 2:
                    wall3 = dataArray;
                    break;
                case 3:
                    wall4 = dataArray;
                    break;
                case 0:
                    wall1 = dataArray;
                    break;
                default:
                    break;
            }
        } else {
            wall1 = dataArray.slice(0, dataArray.length / 4); // roof
            wall2 = dataArray.slice(dataArray.length / 4, dataArray.length / 2); // right wall
            wall3 = dataArray.slice(
                dataArray.length / 2,
                (dataArray.length / 2) + (dataArray.length / 4)
            ); // floor
            wall4 = dataArray.slice(
                (dataArray.length / 2) + (dataArray.length / 4),
                dataArray.length
            ); // left wall
        }

        let wall1Freqs = [];
        let wall2Freqs = [];
        let wall3Freqs = [];
        let wall4Freqs = [];

        if (freqData.length < 4) {
            switch (randomResult) {
                case 1:
                    wall2Freqs = freqData;
                    break;
                case 2:
                    wall3Freqs = freqData;
                    break;
                case 3:
                    wall4Freqs = freqData;
                    break;
                case 0:
                    wall1Freqs = freqData;
                    break;
                default:
                    break;
            }
        } else {
            wall1Freqs = freqData.slice(0, freqData.length / 4); // roof
            wall2Freqs = freqData.slice(freqData.length / 4, freqData.length / 2); // right wall
            wall3Freqs = freqData.slice(
                freqData.length / 2,
                (freqData.length / 2) + (freqData.length / 4)
            ); // floor
            wall4Freqs = freqData.slice(
                (freqData.length / 2) + (freqData.length / 4),
                freqData.length
            ); // left wall
        }

        const wall1Balls = wall1.map((number, i) => {
            const frequency = wall1Freqs[i];
            const adjustedFrequency = frequency / 10;
            const adjustedAvgFrequency = (((this.lastAvgFrequency + this.lastAvgTimeDomain) / 2) - 128) / 10;

            const percentage = number / 255;
            const xPosition = canvas.width - (canvas.width * percentage);
            const yPosition = 0;
            const vector = new Vector(adjustedAvgFrequency, adjustedFrequency);

            return new Ball(new Vector(xPosition, yPosition), vector, frequency);
        });

        const wall2Balls = wall2.map((number, i) => {
            const frequency = wall2Freqs[i];
            const adjustedFrequency = frequency / 10;
            const adjustedAvgFrequency = (((this.lastAvgFrequency + this.lastAvgTimeDomain) / 2) - 128) / 10;

            const percentage = number / 255;
            const yPosition = canvas.height - (canvas.height * percentage);
            const xPosition = canvas.width;
            const vector = new Vector(-adjustedFrequency, -adjustedAvgFrequency);

            return new Ball(new Vector(xPosition, yPosition), vector, frequency);
        });

        const wall3Balls = wall3.map((number, i) => {
            const frequency = wall3Freqs[i];
            const adjustedFrequency = frequency / 10;
            const adjustedAvgFrequency = (((this.lastAvgFrequency + this.lastAvgTimeDomain) / 2) - 128) / 10;

            const percentage = number / 255;
            const xPosition = canvas.width * percentage;
            const yPosition = canvas.height;
            const vector = new Vector(-adjustedAvgFrequency, -adjustedFrequency);

            return new Ball(new Vector(xPosition, yPosition), vector, frequency);
        });

        const wall4Balls = wall4.map((number, i) => {
            const frequency = wall4Freqs[i];
            const adjustedFrequency = frequency / 10;
            const adjustedAvgFrequency = (((this.lastAvgFrequency + this.lastAvgTimeDomain) / 2) - 128) / 10;

            const percentage = number / 255;
            const yPosition = canvas.height * percentage;
            const xPosition = 0;
            const vector = new Vector(adjustedFrequency, adjustedAvgFrequency);

            return new Ball(new Vector(xPosition, yPosition), vector, frequency);
        });

        const newBalls = [...wall1Balls, ...wall2Balls, ...wall3Balls, ...wall4Balls];

        for (const newBall of newBalls) {
            newBall.update(canvas);
        }

        this.balls = this.balls.concat(newBalls);
    }

    draw(canvas, context) {
        context.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        const rounded = this.lastAvgFrequency / 255;
        context.fillStyle = `rgba(100, 0, 0, ${rounded.toFixed("2")})`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        this.balls.forEach(ball => ball.draw(canvas, context));

        this.player.draw(context);
    }

    randomSeeded() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    getRandom(min, max) {
        return Math.floor((this.randomSeeded() * max) - min);
    }

    parseData(array) {
        let newData = [];
        if (this.blockSize >= array.length) {
            newData = [...array].slice(0, 1);
        } else {
            for (let arrayIndex = 0; arrayIndex < array.length - this.blockSize; arrayIndex += this.blockSize) {
                const block = array.slice(arrayIndex, arrayIndex + this.blockSize);
                const avg = block.reduce((acc, curr) => acc + curr, 0) / block.length;
                newData.push(avg);
            }
        }
        return newData;
    }
}

export default Level;
*/