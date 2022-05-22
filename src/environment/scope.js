/*

    Scopes hold variables (including functions) and other scopes.
    Scope is a tree of scopes. Every scope knows about its parent scope.
    Scopes are used to resolve variable references.
        If the immediate scope doesn't have a variable, it will recursively check its parent scope(s).

*/

class Scope {

    constructor(parent, contents, reference) {

        if(!(parent instanceof Scope) && parent !== null)
            throw new Error("Parent must be a Scope or null: " + parent);
        this.parent = parent;

        if(!(contents instanceof Object))
            throw new Error("Contents must be an object: " + contents);
        this.contents = contents;

        // This lets us give the scope a unique key within the parent scope's table.
        this.reference = reference || crypto.randomUUID();

    }

    // Gets a value from this scope.
    // If the value doesn't exist, it will recursively check its parent scope(s).
    getValue(name) {
        if (this.contents.hasOwnProperty(name))
            return this.contents[name];
        else if (this.parent)
            return this.parent.getValue(name);
        else
            return undefined;
    }

    // Sets a value in this scope.
    // Returns the value.
    setValue(name, value) {
        return this.contents[name] = value;
    }

    // Delete a value from this scope
    deleteValue(name) {
        return delete this.contents[name];
    }
}

const { BuiltInFunction, builtinFxns } = require('../std-library/builtinfxns.js');

// Global Scopes are the top-level scopes.
// They are used to hold immutable global variables and functions.
// Every program must be a scope within a global scope.
class GlobalScope extends Scope {

    constructor() {

        const contents = {
            ...builtinFxns
        }

        super(null, contents);
    }

    // Don't allow storing anything in the global scope.
    setValue(name, value) {
        throw new Error("Cannot set values in global scope: " + name + " = " + value);
    }

    deleteValue(name) {
        throw new Error("Cannot delete values in global scope: " + name);
    }

}

module.exports = { Scope, GlobalScope };