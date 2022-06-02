class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Tokenizer {
    constructor(type, pattern) {
        this.type = type;
        this.pattern = pattern;
        this.filters = [];
    }

    addFilter(filter) {
        this.filters.push(filter);
    }

    match(str) {
        return this.pattern.test(str);
    }

    getToken(str) {
        if (this.match(str)) {
            const out = this.filters.reduce((acc, fn) => fn(acc), str);
            return new Token(this.type, out);
        }
    }
}

/**
 * Tokenizes a string
 * @param {string} str The string to be tokenized
 * @param {Tokenizer[]} tokenizers The tokenizers to apply
 * @returns {Token[]}
 */
function tokenizeString(str, tokenizerList) {
    const out = [];
    while (str.length) {
        const tokenizer = tokenizerList.find(tokenizer => tokenizer.match(str));
        if (!tokenizer)
            throw new Error(`Cannot tokenize string: ${str}`);
        
        const matchString = str.match(tokenizer.pattern)[0];
        str = str.substring(matchString.length); // cut out this part now
        out.push(tokenizer.getToken(matchString));
    }

    return out;
}

const whiteSpaceTokenizer = new Tokenizer('whitespace', /^\s+/);

const commentTokenizer = new Tokenizer('comment', /^#[^#]+#/);

const openParenthesisTokenizer = new Tokenizer('openParenthesis', /^\(/);
const closeParenthesisTokenizer = new Tokenizer('closeParenthesis', /^\)/);

const stringTokenizer = new Tokenizer('string', /^'[^']*'/);
stringTokenizer.addFilter(x => x.slice(1, -1)); // Cut off the quotes

const numberTokenizer = new Tokenizer('number', /^(\d+(\.\d*)?|\.\d+)/);
numberTokenizer.addFilter(x => Number(x));

const identifierTokenizer = new Tokenizer('identifier', /^[^()\s]+/);

const tokenizerList = [
    whiteSpaceTokenizer,
    commentTokenizer,
    openParenthesisTokenizer,
    closeParenthesisTokenizer,
    stringTokenizer,
    numberTokenizer,
    identifierTokenizer,
];

// console.log(tokenizeString('(1 2 3) + (5 6 7) #hello# \'test\'', tokenizerList));