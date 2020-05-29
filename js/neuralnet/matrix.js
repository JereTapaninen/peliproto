import { nextFloat } from "../utils.js";
import { MutationRate } from "../constants.js";

class Matrix {
    rows = -1;
    columns = -1;
    matrix = [];

    get items() {
        const results = new Array(this.rows * this.columns);

        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                results[columnIndex + (rowIndex * this.columns)] = this.matrix[rowIndex][columnIndex];
            }
        }

        return results;
    }

    constructor(rowsOrArray, columns) {
        if (Array.isArray(rowsOrArray)) {
            // initialize matrix with float array
            this.rows = rowsOrArray.length;
            this.columns = 1;
            this.matrix = new Array(this.rows).fill(0).map(() => new Array(this.columns).fill(0));

            for (let arrayIndex = 0; arrayIndex < rowsOrArray.length; arrayIndex++) {
                this.matrix[arrayIndex][0] = rowsOrArray[arrayIndex];
            }
        } else {
            // initialize matrix with rows and columns
            this.rows = rowsOrArray;
            this.columns = columns;
            this.matrix = new Array(this.rows).fill(0).map(() => new Array(this.columns).fill(0));
        }
    }

    dot(other) {
        const result = new Matrix(this.rows, other.columns);

        if (this.columns === other.rows) {
            for (let ownRowIndex = 0; ownRowIndex < this.rows; ownRowIndex++) {
                for (let partnerColumnIndex = 0; partnerColumnIndex < other.columns; partnerColumnIndex++) {
                    let sum = 0;

                    for (let ownColumnIndex = 0; ownColumnIndex < this.columns; ownColumnIndex++) {
                        sum += this.matrix[ownRowIndex][ownColumnIndex] * other.matrix[ownColumnIndex][partnerColumnIndex];
                    }

                    //console.log("helou", this.matrix, other.matrix);

                    result.matrix[ownRowIndex][partnerColumnIndex] = sum;
                }
            }
        } else {
            //console.log("nope!", this.matrix, other.matrix);
        }

        return result;
    }

    addBias() {
        const result = new Matrix(this.rows + 1, 1);

        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            result.matrix[rowIndex][0] = this.matrix[rowIndex][0];
        }
        result.matrix[this.rows][0] = 1;

        return result;
    }

    initialize() {
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                this.matrix[rowIndex][columnIndex] = nextFloat(-1, 1);
            }
        }
    }

    crossover(partner) {
        const result = new Matrix(this.rows, this.columns);

        if (this.rows !== partner.rows || this.columns !== partner.columns)
            throw new Error("Other matrix has different amount of rows or columns!");

        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                const randomResult = Math.random();

                result.matrix[rowIndex][columnIndex] = randomResult > 0.5 ?
                    this.matrix[rowIndex][columnIndex] :
                    partner.matrix[rowIndex][columnIndex];
            }
        }

        return result;
    }

    mutate() {
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                const rand = Math.random();

                if (rand < MutationRate) {
                    this.matrix[rowIndex][columnIndex] = nextFloat(-1, 1);
                }
            }
        }
    }

    activate() {
        const result = new Matrix(this.rows, this.columns);

        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                result.matrix[rowIndex][columnIndex] = this.binaryStep(this.matrix[rowIndex][columnIndex]);
            }
        }

        return result;
    }

    clamp(value, min, max) {
        return value < min ? min : value > max ? max : value;
    }

    binaryStep(x) {
        return x > 0 ? 1 : 0;
    }
}

export default Matrix;
