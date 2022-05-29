
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
    [/^'[^'()]*'/, 'string', x => x.substring(1, x.length-1)],
    [/^nil/, 'nil', x => null],
    [/^(true|false)/, 'boolean', x => x === 'true'],
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

function isBalanced(tokenList) {
    let val = 0;
    for (let t of tokenList) {
        if (t.type == 'openParenthesis')
            val++;
        else if (t.type === 'closeParenthesis')
            val--;
        if (val < 0) // We can never go below 0.
            return false;
    }

    return val === 0;
}

/**
 * Generates a tree from a list of Tokens.
 * @param {Token[]} tokenList The list of tokens to generate the tree from. This list is destroyed.
 * @returns {Array<Token, Array<Token>>} The tree.
 */
function arborizeTokens(tokenList) {

    const tree = [];

    let token;
    while (token = tokenList.shift()) {
        switch(token.type) {
            case 'openParenthesis':
                tree.push(arborizeTokens(tokenList));
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

// Run a callback on layer of the tree, starting from the bottom.
function execute(tree, callback) {
    return callback(...tree.map(x => {
        if (x instanceof Array)
            return execute(x, callback);
        else
            return x;
    }));
}



// Test the arborizer function.

// const p2 =
// `
// test
// (1 2 3 4)
// 'hello world'      # comment time #
// testVar
// ('test' print)
// 'line1
// line2'

// (nil 2 +)
// (3.5 0.2 *)
// `

// console.log(arborizeProgram(p2));
// execute(arborizeProgram(p2), console.log);

// Implement Macros

class Macro {
    constructor(type) {
        this.type = type;
    }
}

// ((arg1 arg2 arg3) (arg1 arg2 arg3 +) fn)
class Function extends Macro {
    constructor(args, body) {
        super('function');
        this.argList = args;
        this.body = body;
    }
    
    /**
     *  Substitutes the arguments in the function body with the given arguments.
     * @param {Array} args The arguments to substitute.}
     */
    subArgs(...args) {
        const argList = this.argList;
        const body = this.body;
        const argMap = argList.reduce((out, arg, i) => {
            out[arg.value] = args[i];
            return out;
        }, {});
        
        return mapLeaves(body, x => {
            if (x.type === 'identifier' && argMap[x.value])
                return argMap[x.value];
            else
                return x;
        });
    }

}

// If macro guarantees we don't do unnecessary computation
class IfBranch extends Macro {
    constructor(condition, _true, _false) {
        super('ifbranch');
        this.condition = condition;
        this._true = _true;
        this._false = _false;
    }

}

// Macros
macros = {};

// ((arg1 arg2 arg3) (arg1 arg2 arg3 +) fn)
macros['fn'] = function(args, body) {
    return new Function(args, body);
}

macros['if'] = function(condition, _then, _else) {
    return new IfBranch(condition, _then, _else);
}

// Apply macros

/**
 * @param {Array<Token, Array<Token>>} tree The tree to apply the macros to.
 * @returns {Array} The tree with macros applied.
 */
function applyMacros(tree, macros) {

    const arraysMapped = tree.map(x => {
        if (x instanceof Array)
            return applyMacros(x, macros);
        else
            return x;
    });

    const last = arraysMapped.at(-1);
    const args = arraysMapped.slice(0, -1);

    for (let t of args)
        if (Object.keys(macros).includes(t.value))
            throw new Error(`Macro ${JSON.stringify(t)} in incorrect position`);

    if (last instanceof Token && last.type === 'identifier' && macros[last.value]) {
        return macros[last.value](...args);
    } else {
        return arraysMapped;
    }
}


// const macroProgram =
// `
// 3
// 4
// (((x y) (x y +) fn) x set)
// ((3 4 >) ('yes' print) ('no' print) if)

// do
// `

// const preMacroProgram = arborizeProgram(macroProgram);
// const postMacroProgram = applyMacros(preMacroProgram, macros);

// console.log(mapLeaves(preMacroProgram, x => x.value));

// console.log(postMacroProgram)

// console.log(postMacroProgram.subArgs(...[9, 10, 21].map(x => new Token('number', x))));

// Implement scopes

class Scope {
    constructor(parent, args) {
        this.parent = parent;
        this.content = args || {};
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

// GlobalScope only accepts value on creation. After that it will not accept any more values.
class GlobalScope extends Scope {
    constructor(args) {
        super(null, args);
    }

    set() {
        throw new Error('Cannot set values in global scope');
    }
}

// Implement a few builtin functions

const builtins = {};

// (15 x set) -> scope[x] = 15
builtins['set'] = function(scope, ...args) {
    if (args.length !== 2)
        throw new Error("Set takes exactly two arguments");
    const value = args[0]; const name = args[1];
    if (name.type !== 'string')
        throw new Error("Set takes a string as the second argument");
    scope.set(name.value, value);
}

// (y get) => scope[y]
builtins['get'] = function(scope, ...args) {
    if (args.length !== 1)
        throw new Error("Get takes exactly one argument");
    const name = args[0];
    if (name.type !== 'string')
        throw new Error("Get takes a string as the argument");
    return scope.get(name.value);
}

builtins['print'] = function(scope, ...args) {
    console.log(...args);
}

// Just returns the last argument
builtins['do'] = function(scope, ...args) {
    return args.at(-1);
}

builtins['>'] = function(scope, l, r) {
    if (l.type !== 'number' || r.type !== 'number')
        throw new Error("Comparison must be between two numbers!");
    return new Token('boolean', l.value > r.value);
}

builtins['+'] = function(scope, l, r) {
    if (l.type !== 'number' || r.type !== 'number')
        throw new Error("Addition must be between two numbers!");
    return new Token('number', l.value + r.value);
}

// Run a program already arborized and macroed.
function runProgram(tree, parentScope) {
    const scope = new Scope(parentScope);

    let result;

    // Run the program
    result = execute(tree, (...args) => {

        const resolved = args.map(x => {
            if (x instanceof Token && x.type === 'identifier') {
                const val = scope.get(x.value);    
                if (val !== undefined)
                    return val;
                else
                    throw new Error(`Cannot resolve ${JSON.stringify(x)}`);
            } else
                return x;
        });

        const last = resolved.at(-1);
        const inputs = resolved.slice(0, -1);

        if (typeof last === 'function')
            return last(scope, ...inputs);
        else if (last instanceof Function) {
            return runProgram(last.subArgs(...inputs), scope);
        }
        else
            throw new Error(`Cannot execute ${JSON.stringify(last)}`);
    });

    return result;
}


const testProgram =
`
(15 'z' set)
(21 'x' set)

(((x y z) ((x y +) z +) fn) 'add3' set)

(1 2 3 add3)
do
`

const tree = applyMacros(arborizeProgram(testProgram), macros);
// console.log(tree,'\n\n');

const globalScope = new GlobalScope({...builtins});
const result = runProgram(tree, globalScope);
console.log(result);