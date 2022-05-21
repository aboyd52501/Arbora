const { Tree } = require('../src/parsing/util/tree.js');

const newTree = new Tree(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "hello", [1,2,3], {1: 2, 2: 4, 4: 8}, new Tree(-1,-2,-3));
console.log(`newTree: ${newTree}`);

console.log( `newTree types: ${newTree.map(x => 
    typeof(x) === 'object' ? x.constructor.name : typeof(x)
)}` );

console.log( `newTree leaf count: ${newTree.leafCount()}` );