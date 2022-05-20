
// Represents a parsed token with its associated type and value
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

// Represents a pattern that maps to a token
class Tokenizer {
    constructor(pattern, type) {
        this.pattern = new RegExp('^' + pattern, 'i'); // The tokenizer program reads the string from the beginning, trimming as it goes.
        this.type = type;
    }

    match(string) {
        return string.match(this.pattern);
    }
    
    // Creates a token from a string
    // value doesn't necessarily have to match the tokenizer's pattern
    createToken(value) {
        return new Token(this.type, value);
    }
}

// program is a string representing the program to be tokenized
// tokenizerList is the list of tokenizers to use, in sequential order
function tokenizeProgram(program, tokenizerList) {
    let tokens = []; // the list of tokens to be returned
    let programMutate = program; // this will be mutated as we tokenize the program.
    
    while(programMutate.length) {
        let match = null;
        const tokenizer = tokenizerList.find(t => match = t.match(programMutate));
        if (tokenizer) {
            const token = tokenizer.createToken(match[0]);
            tokens.push(token);
            programMutate = programMutate.slice(match[0].length);
            //console.log(match, token, tokens, programMutate);
        } else {
            throw new Error(`Invalid token in input stream: "${programMutate}"`);
        }
    }
    
    return tokens.filter(t => t.type !== 'WhiteSpace' && t.type !== 'Comment'); // remove whitespace and comments
}

const arboraTokenizerList = [
    new Tokenizer('#[^#]*#', 'Comment'),
    new Tokenizer('\\s+', 'WhiteSpace'),
    new Tokenizer('\\(', 'LParen'),
    new Tokenizer('\\)', 'RParen'),
    new Tokenizer('\\d+', 'Number'),
    new Tokenizer('\"[^\"]*\"', 'String'),
    new Tokenizer('\\w+', 'Identifier')
];

const tokenizeArbora = (program) => tokenizeProgram(program, arboraTokenizerList);

module.exports = { tokenizeArbora };