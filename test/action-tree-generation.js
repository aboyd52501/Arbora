const { generateArboraActionTree } = require("../src/parsing/action-tree-generator.js");

const program = 
`
    "this is a string literal"
    21 var
    true false
    ("hello world" print)
    (
        (1 2 +)
        (3 4 *)
        /
    )
    do
`;


const tree = generateArboraActionTree(program);
console.log(tree);