
class BuiltInFunction {
    constructor(name, func) {
        this.name = name;
        this.func = func;
        this.argCount = func.length;
    }
}

const builtinFxns = {
    // Control flow functions
    'if': new BuiltInFunction('if', (_if, _then, _else) => _if ? _then : _else),
    'do': new BuiltInFunction('do', (...args) => args.at(-1)), // just return the last argument.

    // Math functions
    '+': new BuiltInFunction('+', (a, b) => a + b),
    '-': new BuiltInFunction('-', (a, b) => a - b),
    '*': new BuiltInFunction('*', (a, b) => a * b),
    '/': new BuiltInFunction('/', (a, b) => a / b),
    '%': new BuiltInFunction('%', (a, b) => a % b),
    '^': new BuiltInFunction('^', (a, b) => Math.pow(a, b)),

    // Comparison functions
    '<': new BuiltInFunction('<', (a, b) => a < b),
    '>': new BuiltInFunction('>', (a, b) => a > b),
    '<=': new BuiltInFunction('<=', (a, b) => a <= b),
    '>=': new BuiltInFunction('>=', (a, b) => a >= b),
    '=': new BuiltInFunction('=', (a, b) => a == b),
    '!=': new BuiltInFunction('!=', (a, b) => a != b),

    // Logical functions
    '&&': new BuiltInFunction('&&', (a, b) => a && b),
    '||': new BuiltInFunction('||', (a, b) => a || b),
    '!' : new BuiltInFunction('!', (a) => !a),

    // String functions
    'str': new BuiltInFunction('str', (a) => a.toString()),
    'len': new BuiltInFunction('len', (a) => a.length),
    'sub': new BuiltInFunction('sub', (a, b, c) => a.substring(b, c)),
    'concat': new BuiltInFunction('concat', (a, b) => a.concat(b)),
    'contains?': new BuiltInFunction('contains?', (a, b) => a.includes(b)),
    'index-of': new BuiltInFunction('index-of', (a, b) => a.indexOf(b)),
    'replace': new BuiltInFunction('replace', (a, b, c) => a.replace(b, c)),
    'split': new BuiltInFunction('split', (a, b) => a.split(b)),
    'join': new BuiltInFunction('join', (a, b) => a.join(b)),
    'trim': new BuiltInFunction('trim', (a) => a.trim()),
    'to-upper': new BuiltInFunction('to-upper', (a) => a.toUpperCase()),
    'to-lower': new BuiltInFunction('to-lower', (a) => a.toLowerCase()),

    // Array functions
    'array': new BuiltInFunction('array', (...args) => [...args]),
    'pop': new BuiltInFunction('pop', (a) => a.pop()),
    'push': new BuiltInFunction('push', (a, b) => a.push(b)),
    'unshift': new BuiltInFunction('unshift', (a, b) => a.unshift(b)),
    'shift': new BuiltInFunction('shift', (a) => a.shift()),
    'reverse': new BuiltInFunction('reverse', (a) => a.reverse()),
    'sort': new BuiltInFunction('sort', (a) => a.sort()),
    'slice': new BuiltInFunction('slice', (a, b, c) => a.slice(b, c)),

    // Input/Output functions
    'print': new BuiltInFunction('print', (...args) => console.log(...args)),
}

module.exports = { BuiltInFunction, builtinFxns };