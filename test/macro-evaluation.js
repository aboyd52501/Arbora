const { generateArboraActionTree } = require("../src/parsing/action-tree-generator.js");
const { Action } = require("../src/parsing/util/action.js");
const { DataType } = require("../src/environment/datatypes.js");

const program = 
`
    (x y) ((x y *) print)
    fn
`;

class FunctionType extends DataType {

    /**
     * @param {Action} body The function body.
     */
    constructor(body) {
        super('Function', body);
    }

    eval(scope, ...args) {
        
    }

}


const tree = generateArboraActionTree(program);
console.log(tree);

// console.log('\n\n');

const macros = {};

macros['fn'] = (...args) => {
    console.assert(args.length === 2, "fn macro requires two arguments. args: " + args);

    const argList = args[0];
    const body = args[1];

    return new FunctionType([argList, body]);
}

// Apply macros to the tree.
const out = tree.execute((f, ...args) => {
    const fname = f.value;
    if (macros.hasOwnProperty(fname))
        return macros[fname](...args);
    else
        return new Action(f, ...args);
});

console.log(out);
console.log(out.value);