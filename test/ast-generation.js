const { parseArbora } = require('../src/ast-generator.js');

const program = 
`((3 4 add) (5 6 add) mul) # comment #
(1 2 3 4 5 add) # are comments working? #
123 "hello world" # number #
hello     `;

const AST = parseArbora(program);
console.log(AST);