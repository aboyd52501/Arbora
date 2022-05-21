const { generateTypeCastedArboraTree } = require('../src/parsing/ast-type-caster.js');

const program = 
`((3 4 add) (5 6 add) mul) # comment #
(1 2 3 4 5 add) # are comments working? #
123 "hello world" # number #
"hel
lo"     `;


const actionTree = generateTypeCastedArboraTree(program);
console.log(actionTree);
console.log(JSON.stringify(actionTree, null, 2));