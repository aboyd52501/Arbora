const { parseArbora } = require('./ast-generator.js');
const { typePatterns } = require('../environment/datatypes.js');


function typeCastTree(ast) {
    return ast.map(processAtom);
}

function processAtom(value) {
    const foundPattern = typePatterns.find(patternTuple => patternTuple[0].test(value));
    if (foundPattern)
        return new foundPattern[1](value);
    else
        throw new Error(`Invalid atom: ${value}`);
}

function generateTypeCastedArboraTree(program) {
    const ast = parseArbora(program);
    return typeCastTree(ast);
}

module.exports = { generateTypeCastedArboraTree };