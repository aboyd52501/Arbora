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

console.log('\n\n');

tree.execute((f, ...args) => {
    console.log(`\nRunning function\n`, f, '\nwith args \n', args)
    console.log('');
    return `${f.value}(${args.map(x=>x.value||x).join(', ')})`;
});