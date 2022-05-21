const { parseArbora } = require('../src/parsing/ast-generator.js');

const program = 
`((3 4 add) (5 6 add) mul) # comment #
(1 2 3 4 5 add) # are comments working? #
123 "hello world" # number #
"hel
lo"     `;

const AST = parseArbora(program);
console.log(AST);