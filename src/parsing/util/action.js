const { Tree } = require('./tree.js');

class Action extends Tree { 
    constructor(functionIdentifier, ...args) {
        super(...args);
        this.functionIdentifier = functionIdentifier;
    }
}

module.exports = { Action };