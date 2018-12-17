//7:22am - start

const fs = require('fs')
var rawInput = fs.readFileSync('12.txt').toString().trim().split('\n')
var firstGen = rawInput[0];
var ruleSet = rawInput.slice(1);
var rules = {}
console.log(firstGen)
ruleSet.forEach(rule => {
    var parsed = parseRule(rule)
    rules[parsed.prevGen] = parsed.nextGen
});
console.log(rules)


function parseRule(rule) {
    var ruleParts = rule.split(' => ')
    var nextGen = ruleParts[1]// === '#';
    var prevGen = ruleParts[0];

    return { prevGen, nextGen };
}

function generate(initialState) {
    var pots = initialState.split('');
    // for()
}

function createGenerations(generations, depth) {
    if (!depth || !generations.length) {
        return generations
    }

    var currentGeneration = generations[generations.length - 1]
    var nextGeneration = []

    var currGenLen = currentGeneration.length
    console.log(currGenLen)
    // for (var i = 0; i < currGenLen; i++) {
    for (var i = -2; i < currGenLen + 2; i++) {
        var comparisonStr = ''

        for(var pos = i - 2; pos < i + 3; pos++) {
            comparisonStr += currentGeneration[pos] || '.'
        }
        /*if (i <= 0) comparisonStr += '..'
        else if (i <= 1) comparisonStr += '.' + currentGeneration[i - 1]
        else comparisonStr += currentGeneration[i - 2] + currentGeneration[i - 1]

        comparisonStr += currentGeneration[i]

        if(i >= currGenLen - 2) comparisonStr += currentGeneration[i+1] + '.'
        else if(i >= currGenLen - 1) comparisonStr += currentGeneration + '..'
        else comparisonStr += currentGeneration[i + 1] + currentGeneration[i + 2]*/
        // console.log(comparisonStr)
        nextGeneration.push(rules[comparisonStr])
    }

    generations.push(nextGeneration)
    createGenerations(generations, depth - 1)
    return generations
}
//TODO keep a pointer on the "first pot of gen"
var generations = createGenerations([firstGen.split('')], 20)
console.log('p1', generations.pop().reduce((acc, val) => acc + (val == '#' ? 1 : 0), 0))
generations.forEach((gen, index) => console.log(index+ '     '+gen.join('')))
// console.log(createGenerations([firstGen], 2))

// console.log(parseRule('...## => #'))