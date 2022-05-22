class DataType {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class NumberType extends DataType {
    constructor(value) {
        super('Number', Number(value));
    }
}

class StringType extends DataType {
    constructor(value) {
        super('String', value.substring(1, value.length - 1));
    }
}

// Booleans aren't case sensitive.
class BooleanType extends DataType {
    constructor(value) {
        super('Boolean', value.toUpperCase() === 'TRUE');
    }
}

class VoidType extends DataType {
    constructor() {
        super('Void', null);
    }
}

// Identifiers aren't case sensitive.
class IdentifierType extends DataType {
    constructor(value) {
        super('Identifier', value.toUpperCase());
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