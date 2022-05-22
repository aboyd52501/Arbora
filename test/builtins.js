const { Scope, GlobalScope } = require('../src/environment/scope.js');
const { generateArboraActionTree } = require('../src/parsing/action-tree-generator.js');
const { BuiltInFunction } = require('../src/std-library/builtinfxns.js');

const thisGlobalScope = new GlobalScope();

const programScope = new Scope(thisGlobalScope, {});

const program = 
`
    "this is a string literal"
    21 var
    true false
    # this comment shouldn't show up at all. #
    /
    ("hello world" print)
    (
        (1 2 +)
        (3 4 *)
        /
    )

    do
`;

const variadicFxnTest =
`
    (3 3 10 *)
    5
    /
`

function runProgram(program) {
    const actionTree = generateArboraActionTree(program);
    const varTree = actionTree.map(x => x.eval(programScope));

    const out = varTree.execute((func, ...args) => {
        if (func instanceof BuiltInFunction)
            return func.func(...args);
        else
            return func;
    });

    return out;
}


console.log(runProgram(program));
console.log('\n');
console.log(runProgram(variadicFxnTest));