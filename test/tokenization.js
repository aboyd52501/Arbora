const { Tokenizer, tokenizeProgram } = require('../src/tokenizer.js');

const program = 
`((3 4 add) (5 6 add) mul); # comment #
(1 2 3 4 5 add); # are comments working? #
123; "hello world"; # number #
hello;     `;

const myTokenizerList = [
    new Tokenizer('#[^#]*#', 'Comment'),
    new Tokenizer('\\s+', 'WhiteSpace'),
    new Tokenizer('\\(', 'LParen'),
    new Tokenizer('\\)', 'RParen'),
    new Tokenizer(';', 'LineEnd'),
    new Tokenizer('\\d+', 'Number'),
    new Tokenizer('\"[^\"]*\"', 'String'),
    new Tokenizer('\\w+', 'Identifier')
];

const output = tokenizeProgram(program, myTokenizerList);
console.log(output.filter(t => t.type !== 'WhiteSpace'));