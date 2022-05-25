
function Token(type, value) {
    this.type = type;
    this.value = value;
}

function Tokenizer(pattern, type, callback) {
    this.pattern = pattern;
    this.type = type;
    this.callback = callback;

    this.createToken = function(value) {
        if (this.callback)
            value = this.callback(value);
        return new Token(this.type, value);
    }
}

// The list of tokens used to tokenize the program.
// The first element is the pattern, the second is the token type.
// The third element is the data interpreter.
const tokenizers = [
    [/^#[^#]*#/, 'comment'],
    [/^\s+/, 'whitespace'],
    [/^\(/, 'openParenthesis'],
    [/^\)/, 'closeParenthesis'],
    [/^[\d.]+/, 'number', x => Number(x)],
    [/^"[^"()]*"/, 'string', x => x.substring(1, x.length-1)],
    [/^nil/, 'nil', x => null],
    [/^[^\s()]+/, 'identifier']
].map(x => new Tokenizer(...x));


/**
 * Tokenizes a program given a list of Tokenizers.
 * @param {string} program The program to be tokenized.
 * @param {Tokenizer[]} tokenizerList The list of Tokenizers to use.
 * @returns {Token[]} The list of tokens.
 */
function tokenize(program, tokenizerList) {
    let tokens = []; // The list of tokens to be output.
    let index = 0; // Where we are in the program.

    while (index < program.length) {

        const remainingProgram = program.slice(index);

        for (let i = 0; i < tokenizerList.length; i++) {

            const currentTokenizer = tokenizerList[i];
            const { pattern } = currentTokenizer;
            const match = remainingProgram.match(pattern);

            if (match) {
                const matchedString = match[0];
                index += matchedString.length;
                tokens.push(currentTokenizer.createToken(matchedString));
                break; // Destroy this for loop so we don't skip any patterns higher up on the list now that we've matched one.
            }
        }
    }

    return tokens;
}

// Test the tokenizer function.

// const p =
// `
// (1 2 3 4)
// "hello world"      # comment time #
// testVar
// ("test" print)
// `

// console.log(tokenize(p, tokenizers));

/**
 * Generates a tree from a list of Tokens.
 * @param {Token[]} tokenList The list of tokens to generate the tree from.
 * @returns {Array<Token, Array<Token>>} The tree.
 */
function arborizeTokens(tokenList) {
    
    const filteredTokenList = tokenList.filter(x => x.type !== 'whitespace' && x.type !== 'comment');

    const tree = [];

    for (let _ = 0; _ < filteredTokenList.length; _++) {
        const token = filteredTokenList[_];

        switch(token.type) {
            case 'openParenthesis':
                const subTree = arborizeTokens(filteredTokenList.slice(_ + 1));
                tree.push(subTree);
                _ += subTree.length + 1;
                break;

            case 'closeParenthesis':
                return tree;
                break;

            case 'whitespace':
                break;
            
            case 'comment':
                break;

            default:
                tree.push(token);

        }
    }

    return tree;

}

function arborizeProgram(program) {
    return arborizeTokens(tokenize(program, tokenizers));
}

function mapLeaves(tree, fn) {
    if (!(tree instanceof Array))
        return fn(tree);
    else
        return tree.map(x => mapLeaves(x, fn));
}

// // Test the arborizer function.

// const p2 =
// `
// test
// (1 2 3 4)
// "hello world"      # comment time #
// testVar
// ("test" print)
// "line1
// line2"

// (nil 2 +)
// (3.5 0.2 *)
// `

// console.log(arborizeProgram(p2));

// Implement scopes

class Scope {
    constructor(parent, ...args) {
        this.parent = parent;
        this.content = args;
    }

    get(name) {
        if (this.content.hasOwnProperty(name))
            return this.content[name];
        else if (this.parent)
            return this.parent.get(name);
        else
            return undefined;
    }

    set(name, value) {
        return this.content[name] = value;
    }
}


// Implement data types

class DataType {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    eval(...args) {
        return this.value;
    }
}

class StringType extends DataType {
    constructor(value) {
        super('string', value);
    }
}

class NumberType extends DataType {
    constructor(value) {
        super('number', value);
    }
}

class NilType extends DataType {
    constructor() {
        super('nil', null);
    }
}

// References another datatype
class IdentifierType extends DataType {
    constructor(value) {
        super('identifier', value);
    }

    /**
     * Returns the value of the identifier.
     * @param {Scope} scope The scope to look in.
     * @returns {DataType} The value the identifier is referencing.
     */
    eval(scope) {
        return scope[this.value];
    }
}

// ((arg1 arg2 arg3) (arg1 arg2 arg3 +) fn)
class FunctionType extends DataType {
    constructor(value) {
        super('function', value);
    }

    eval(...args) {
        const argList = this.value[0];
        const body = this.value[1];
        const argMap = argList.reduce((acc, arg, i) => {
            acc[arg] = args[i];
            return acc;
        }, {});

        return mapLeaves(body, x => {
            if (x.type === 'identifier' && argMap[x.value])
                return argMap[x.value];
            else
                return x;
        }
    }
}

// Macros
macros = {};

// ((arg1 arg2 arg3) (arg1 arg2 arg3 +) fn)
macros['fn'] = function(argList, body) {
    return new FunctionType([argList, body]);
}

macros['if'] = function(condition, _then, _else) {
    return condition.eval()
}

// Functions
builtins = {};