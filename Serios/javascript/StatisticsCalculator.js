/**
 * Class representing a Statistics Calculator
 * @export
 * @class StatisticsCalculator
 */
export default class StatisticsCalculator {
    /**
     * Create a StatisticsCalculator
     * @constructor
     */
    constructor() {
        /** @type {number} */
        this.countInt = 0;
        /** @type {number} */
        this.count = 0;
        /** @type {number} */
        this.sum = 0;
        /** @type {number} */
        this.avg = 0;
        /** @type {number} */
        this.max = Number.MIN_SAFE_INTEGER;
        /** @type {number} */
        this.min = Number.MAX_SAFE_INTEGER;
        /** @type {boolean} */
        this.anyIntExist = false;
    }
    
    /**
     * Get the count of numbers
     * @returns {number} The count
     */
    getcount() {
        return this.count;
    }

    /**
     * Get the sum of numbers
     * @returns {number} The sum
     */
    getsum() {
        return this.sum;
    }

    /**
     * Get the average of numbers
     * @returns {number} The average
     */
    getavg() {
        return this.avg;
    }

    /**
     * Get the maximum number
     * @returns {number} The maximum
     */
    getmax() {
        return this.max;
    }

    /**
     * Get the minimum number
     * @returns {number} The minimum
     */
    getmin() {
        return this.min;
    }
     
    /**
     * Get all statistics
     * @returns {number[]} Array of [count, sum, avg, max, min]
     */
    getAll() {
        return [
            this.count,
            this.sum,
            this.avg,
            this.max,
            this.min
        ];
    }

    /**
     * Set the count of numbers
     * @param {number} count - The count to set
     */
    setcount(count) {
        this.count = count;
    } 

    /**
     * Set the sum of numbers
     * @param {number} sum - The sum to set
     */
    setsum(sum) {
        this.sum = sum;
    }

    /**
     * Set the average of numbers
     * @param {number} avg - The average to set
     */
    setavg(avg) {
        this.avg = avg;
    }

    /**
     * Set the maximum number
     * @param {number} max - The maximum to set
     */
    setmax(max) {
        this.max = max;
    }
    
    /**
     * Set the minimum number
     * @param {number} min - The minimum to set
     */
    setmin(min) {
        this.min = min;
    }

    /**
     * Display all statistics in the HTML
     */
    display() {
        /** @type {HTMLElement} */
        var count = document.getElementById("count");
        count.innerHTML = ` ${this.count}`;

        /** @type {HTMLElement} */
        var sum = document.getElementById("sum");
        sum.innerHTML = ` ${(this.anyIntExist)? this.sum : 0}`;

        /** @type {HTMLElement} */
        var avg = document.getElementById("avg");
        avg.innerHTML = ` ${(this.anyIntExist)? this.avg : 0}`;

        /** @type {HTMLElement} */
        var max = document.getElementById("max");
        max.innerHTML = ` ${(this.anyIntExist)? this.max : 0}`;

        /** @type {HTMLElement} */
        var min = document.getElementById("min");
        min.innerHTML = ` ${(this.anyIntExist)? this.min : 0}`;
    }

    /**
     * Reset all statistics and clear the display
     */
    resetAll() {
        /** @type {HTMLElement} */
        var count = document.getElementById("count");
        count.innerHTML = ``;
        this.count = 0;
        this.countInt = 0;

        /** @type {HTMLElement} */
        var sum = document.getElementById("sum");
        sum.innerHTML = ``;
        this.sum = 0;

        /** @type {HTMLElement} */
        var avg = document.getElementById("avg");
        avg.innerHTML = ``;
        this.avg = 0;

        /** @type {HTMLElement} */
        var max = document.getElementById("max");
        max.innerHTML = ``;
        this.max = Number.MIN_SAFE_INTEGER;

        /** @type {HTMLElement} */
        var min = document.getElementById("min");
        min.innerHTML = ``;
        this.min = Number.MAX_SAFE_INTEGER;

        this.anyIntExist = false;
    }
}