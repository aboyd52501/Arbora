const { Tree } = require("./util/tree.js");
const { Action } = require('./util/action.js');
const { generateTypeCastedArboraTree } = require('./ast-type-caster.js');
const { IdentifierType } = require('../std-library/datatypes.js');

// [[1, 2, add], 3, mul] -> mul[add[1, 2], 3]
// Action trees represent a ready-to-run program that has not been passed to the interpreter yet.
function generateActionTree(typedAST) {
    
    const last = typedAST.pop();

    const tree = new Action();

    if(last instanceof Tree)
        tree.functionIdentifier = generateActionTree(last);
    else if(!(last instanceof IdentifierType))
        throw new Error("Invalid function call: " + last);
    else
        tree.functionIdentifier = last;

    let current = null;
    while (current = typedAST.shift()) {
        if (current instanceof Tree)
            tree.push(generateActionTree(current));
        else
            tree.push(current);
    }

    return tree;
}

function generateArboraActionTree(program) {
    const typedAST = generateTypeCastedArboraTree(program);
    return generateActionTree(typedAST);
}

module.exports = { generateArboraActionTree };