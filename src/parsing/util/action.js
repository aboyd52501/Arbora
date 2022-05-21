const { Tree } = require('./tree.js');

class Action extends Tree { 
    constructor(functionIdentifier, ...args) {
        super(...args);
        this.functionIdentifier = functionIdentifier;
    }

    // Runs a callback with each Action in the entire action tree, recursively.
    forEach(callback) {
        const func = this.functionIdentifier instanceof Action
            ? this.functionIdentifier.forEach(callback)
            : this.functionIdentifier;
        
        const args = this.children.map(child => {
            if (child instanceof Action)
                return child.forEach(callback);
            else
                return child;
        });

        return callback(func, ...args);
    }
}

module.exports = { Action };