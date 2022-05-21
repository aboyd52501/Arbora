const { parseArbora } = require('./ast-generator.js');
const { typePatterns } = require('../std-library/datatypes.js');

/*

    This program converts abstract syntax trees into action trees.
    In action trees each Leaf node is given an associated variable or literal value.
    Each Branch node is given an associated evaluation function.

*/

function generateActionTree(ast) {
    
    const actionTree = [];

    ast.forEach(node => {
        if(node instanceof Array) {
            actionTree.push(generateActionTree(node));
        } else {
            try {
                actionTree.push(processAtom(node));
            } catch(e) {
                throw `${e} in AST: ${ast}`;
            }
        }
    });

    return actionTree;
}

function processAtom(value) {
    const foundPattern = typePatterns.find(patternTuple => patternTuple[0].test(value));
    if (foundPattern)
        return new foundPattern[1](value);
    else
        throw new Error(`Invalid atom: ${value}`);
}

const generateArboraActionTree = (program) => generateActionTree(parseArbora(program));

module.exports = { generateArboraActionTree };