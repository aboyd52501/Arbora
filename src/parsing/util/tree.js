// Tree is list of arbitrary dimension bundled with some useful helper functions.
class Tree {

    constructor(...args) {
        this.children = args;
    }

    push(...args) {
        return this.children.push(...args);
    }

    pop() {
        return this.children.pop();
    }

    unshift(...args) {
        return this.children.unshift(...args);
    }

    shift() {
        return this.children.shift();
    }

    // Maps every leaf in the tree using a given callback
    map(callback) {
        const out = new Tree();
        
        this.children.forEach(child => {
            if (child instanceof Tree)
                out.push(child.map(callback));
            else
                out.push(callback(child));
        })

        return out;
    }

    forEach(callback) {
        this.children.forEach(child => {
            if (child instanceof Tree)
                child.forEach(callback);
            else
                callback(child);
        });
    }

    reduce(callback, initialValue) {
        return this.children.reduce(callback, initialValue);
    }

    leafCount() {
        return this.reduce((acc, child) => {
            if(child instanceof Tree)
                return acc + child.leafCount();
            else
                return acc + 1;
        }, 0);
    }

    toString() {
        let out = '[ ';
        
        this.children.forEach(child => {
            out += child.toString() + ', ';
        });

        out += ' ]';

        return out;
    }
}

module.exports = { Tree };