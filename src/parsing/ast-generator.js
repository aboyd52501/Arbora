const { tokenizeArbora } = require('./tokenizer.js');

class Node {
    constructor(type, value, children) {
        this.type = type;
        this.value = value;
        this.children = children;
    }
}

function BranchNode(children) {
    return new Node('Branch', null, children);
}

function LeafNode(value) {
    return new Node('Leaf', value, null);
}

// takes a list of tokens and generates a syntax tree
function generateAST(tokenList) {
    let tree = BranchNode([]); // root node
    
    let currentToken = null;
    while(currentToken = tokenList.shift()) {
        switch(currentToken.type) {
            case 'Atom':
                tree.children.push(LeafNode(currentToken.value));
                break;
            case 'LParen':
                const subTree = generateAST(tokenList);
                tree.children.push(subTree);
                break;
            case 'RParen':
                return tree;
                break;
            default:
                throw new Error(`Unexpected token ${currentToken.type}`);
        }
    }

    return tree;
}

function parseArbora(program) {
    const tokens = tokenizeArbora(program);
    return generateAST(tokens);
}

module.exports = { parseArbora };