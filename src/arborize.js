const { tokenizeArbora, Token, Tokenizer, tokenizeString } = require("./tokenize.js");

class Tree {
    constructor(...children) {
        this.children = children;
    }

    push(...args) {
        return this.children.push(...args);
    }

    mapLeaves(fn) {
        let out = new Tree();
        for (let child of this.children) {
            if (child instanceof Tree)
                out.push(child.mapLeaves(fn));
            else
                out.push(fn(child));
        }

        return out;
    }
}

function arborizeTokens(tokenList) {
    let out = new Tree();
    let thisToken;
    while (thisToken = tokenList.shift()) {
        switch(thisToken.type) {
            case 'openParenthesis':
                out.push(arborizeTokens(tokenList));
                break;
            case 'closeParenthesis':
                return out;
                break;
            case 'whitespace':
                break;
            case 'comment':
                break;
            default:
                out.push(thisToken);
        }
    }

    return out;
}

function arborizeArbora(program) {
    return arborizeTokens(tokenizeArbora(program));
}

module.exports = { Tree, arborizeTokens, arborizeArbora };

// const p =
// `
// (1 2 3 +)
// "hello world"
// # comment! #

// 1 2 # inline comment! # 3
// `

// const tokens = tokenizeArbora(p);
// const tree = arborizeTokens(tokens);

// console.log(tree);

// console.log(tokenizeString('(1 2 3) + (5 6 7) #hello# \'test\'', tokenizerList));