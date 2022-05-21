const { tokenizeArbora } = require('./tokenizer.js');

// takes a list of tokens and generates a syntax tree
// Token[] -> [[1, 2, 3], [4, 5], 7, 8, "hello", var, func]
function generateAST(tokenList) {
    let tree = [];
    let currentToken = null;
    while (currentToken = tokenList.shift()) {
        switch (currentToken.type) {
            case 'LParen':
                tree.push(generateAST(tokenList));
                break;
            case 'RParen':
                return tree;
                break;
            case 'Atom':
                tree.push(currentToken.value);
                break;
            default:
                throw new Error(`Invalid token type: ${currentToken.type}`);
        }
    }

    return tree;
}

function parseArbora(program) {
    const tokens = tokenizeArbora(program);
    return generateAST(tokens);
}

module.exports = { parseArbora };