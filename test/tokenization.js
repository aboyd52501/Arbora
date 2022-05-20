const { tokenizeArbora } = require('../src/tokenizer.js');

const program = 
`((3 4 add) (5 6 add) mul) # comment #
(1 2 3 4 5 add) # are comments working? #
123 "hello world" # number #
hel
lo     `;


const output = tokenizeArbora(program);
console.log(output);