const { Tree } = require('./tree.js');

class Action extends Tree { 
    constructor(functionIdentifier, ...args) {
        super(...args);
        this.functionIdentifier = functionIdentifier;
    }

    // Runs a callback with each Action in the entire action tree, recursively.
    execute(callback) {
        const func = this.functionIdentifier instanceof Action
            ? this.functionIdentifier.execute(callback)
            : this.functionIdentifier;
        
        const args = this.children.map(child => {
            if (child instanceof Action)
                return child.execute(callback);
            else
                return child;
        });

        return callback(func, ...args);
    }

    // Maps every leaf in the actionTree using a given callback
    map(callback) {
        const out = new Action(callback(this.functionIdentifier)); // Remember to preserve the functionIdentifier and not just the children!

        this.children.forEach(child => {
            if (child instanceof Action)
                out.push(child.map(callback));
            else
                out.push(callback(child));
        })

        return out;
    }
}

module.exports = { Action };