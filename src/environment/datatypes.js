const { Scope } = require('./scope.js');

class DataType {

    /**
     * @param {string} type - What type of data is this?
     * @param {any} value - The value of the data.
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    /**
     * Returns the value of the data.
     */ 
    eval() {
        return this.value;
    }
}

class NumberType extends DataType {
    /**
     * @param {number} value - The value to be converted to a NumberType.
     */
    constructor(value) {
        super('Number', Number(value));
    }
}

class StringType extends DataType {
    /**
     * @param {string} value - The value to be converted to a StringType.
     */
    constructor(value) {
        super('String', value.substring(1, value.length - 1));
    }
}

// Booleans aren't case sensitive.
class BooleanType extends DataType {
    /**
     * @param {boolean} value - The value to be converted to a BooleanType.
     */
    constructor(value) {
        super('Boolean', value.toLowerCase() === 'true');
    }
}

/**
 * This class represents a null value.
 */
class VoidType extends DataType {
    constructor() {
        super('Void', null);
    }
}

/**
 * This class represents a variable or macro name.
 * The name is not case sensitive.
 * @param {string} value - The name of the identifier.
 */
class IdentifierType extends DataType {

    constructor(value) {
        super('Identifier', value.toLowerCase());
    }

    /**
     * Returns the value of an identifier.
     * @param {Scope} scope - the scope in which to search for the identifier
     */
    eval(scope) {
        return scope.getValue(this.value);
    }
}

const typePatterns = [
    [/^\d+$/, NumberType],
    [/^"[^"]*"$/, StringType],
    [/^(true|false)$/i, BooleanType],
    [/^null$/i, VoidType],
    [/^\S+$/i, IdentifierType]
];

module.exports = {
    typePatterns,
    DataType,
    NumberType,
    StringType,
    BooleanType,
    VoidType,
    IdentifierType
};