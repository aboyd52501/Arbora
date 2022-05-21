const { tokenizeArbora } = require('./tokenizer.js');
const { Tree } = require('./util/tree.js');

// takes a list of tokens and generates a syntax tree
// [Token, Token, Token] -> Tree
function generateAST(tokenList) {
    let tree = new Tree();
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