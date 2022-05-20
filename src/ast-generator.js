const { tokenizeArbora } = require('./tokenizer.js');

// takes a list of tokens and generates a syntax tree
function generateAST(tokenList) {
    let ast = [];
    let currentNode = null;
    while (currentNode = tokenList.shift()) {
        switch(currentNode.type) {
            case 'LParen':
                ast.push(generateAST(tokenList));
                break;
            case 'RParen':
                return ast;
                break;
            default:
                ast.push(currentNode);
        }
    }
    return ast;
}

function parseArbora(program) {
    const tokens = tokenizeArbora(program);
    return generateAST(tokens);
}

module.exports = { parseArbora };