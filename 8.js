const fs = require('fs'),
    TreeModel = require('tree-model')

let testInput = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'.split(' ').map(val => parseInt(val))
let prodInput = fs.readFileSync('8.txt').toString().trim().split(' ').map(val => parseInt(val))
/*
    header
            quantiy of child nodes
            quantity of metadata entries
    zero or more child nodes
    one or more metadata entries
*/

let tree = new TreeModel()

var index = 0
var altID = 0;
function parseTree(tree, input, nodeId) {
    let numChildren = input[index++]
    let numMetas = input[index++]

    let node = tree.parse({ id: nodeId, altID: altID++, metadata: [] })

    nodeId = 1
    while (numChildren) {
        let childNode = parseTree(tree, input, nodeId++)
        node.addChild(childNode)
        numChildren--
    }

    while (numMetas) {
        node.model.metadata.push(input[index++])
        numMetas--
    }
    return node
}

let root = parseTree(tree, testInput, 1)

index = 0
altID = 0
let prodRoot = parseTree(tree, prodInput, 1)

let total = 0
root.walk(null, (node => total += node.model.metadata.reduce((acc, val) => acc + val, 0)))
console.log('total meta:', total)

function findNodeValue(node) {
    if (!node.hasChildren()) {
        return node.model.metadata.reduce((total, val) => total + val, 0)
    }
    let total = 0
    node.model.metadata.forEach(index => {
        if(index) {
            let foundNode = node.first(searchNode => searchNode.parent === node && searchNode !== node && searchNode.model.id === index)
            if (foundNode) total += findNodeValue(foundNode)
        }
    })
    return total
}
console.log('root value:', findNodeValue(root))
console.log('prodRoot value:', findNodeValue(prodRoot))



//3888 is too low

//25910 is the correct answer (according to Matt's program)