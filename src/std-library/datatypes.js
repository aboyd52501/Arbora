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

class BooleanType extends DataType {
    constructor(value) {
        super('Boolean', value === 'true');
    }
}

class VoidType extends DataType {
    constructor() {
        super('Void', null);
    }
}

class IdentifierType extends DataType {
    constructor(value) {
        super('Identifier', value);
    }
}

const typePatterns = [
    [/^\d+$/, NumberType],
    [/^"[^"]*"$/, StringType],
    [/^(true|false)$/, BooleanType],
    [/^null$/, VoidType],
    [/^\S+$/, IdentifierType]
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