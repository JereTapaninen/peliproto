import Matrix from "./matrix.js";

class NeuralNet {
    inputNodes = -1;
    hiddenNodes = -1;
    outputNodes = -1;
    hiddenLayers = -1;

    weights = [];

    constructor(inputNodes, hiddenNodes, outputNodes, hiddenLayers) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.hiddenLayers = hiddenLayers;

        this.weights = new Array(hiddenLayers + 1);
        this.weights[0] = new Matrix(hiddenNodes, inputNodes + 1);

        for (let hiddenLayerIndex = 1; hiddenLayerIndex < hiddenLayers; hiddenLayerIndex++) {
            this.weights[hiddenLayerIndex] = new Matrix(hiddenNodes, hiddenNodes + 1);
        }

        this.weights[this.weights.length - 1] = new Matrix(outputNodes, hiddenNodes + 1);
    }

    output(inputs) {
        const inputsMatrix = new Matrix(inputs);
        //console.log("inputs", inputsMatrix);
        //let currBias = inputsMatrix.addBias();
        let currBias = inputsMatrix.addBias();

        for (let hiddenLayerIndex = 0; hiddenLayerIndex < this.hiddenLayers; hiddenLayerIndex++) {
            //console.log("inside", this.weights[hiddenLayerIndex], currBias);
            const hiddenResults = this.weights[hiddenLayerIndex].dot(currBias);
            //const hiddenV = hiddenResults.activate();
            //const some = hiddenResults.activate();
            currBias = hiddenResults.addBias();
        }

        const outputResults = this.weights[this.weights.length - 1].dot(currBias);
        const outputValues = outputResults.activate().items;

        if (outputValues.length != this.outputNodes)
            throw new Error("Count of output values is not equal to output nodes!");

        return outputValues;
    }

    crossover(other) {
        const result = new NeuralNet(this.inputNodes, this.hiddenNodes, this.outputNodes, this.hiddenLayers);

        if (other.weights.length !== this.weights.length)
            throw new Error("Other has different amount of weights!");

        for (let weightIndex = 0; weightIndex < this.weights.length; weightIndex++) {
            result.weights[weightIndex] = this.weights[weightIndex].crossover(other.weights[weightIndex]);
        }

        return result;
    }

    mutate() {
        for (let weightIndex = 0; weightIndex < this.weights.length; weightIndex++) {
            this.weights[weightIndex].mutate();
        }
    }

    initialize() {
        for (let weightIndex = 0; weightIndex < this.weights.length; weightIndex++) {
            this.weights[weightIndex].initialize();
        }
    }
}

export default NeuralNet;
