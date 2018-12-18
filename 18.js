const fs = require('fs')
var input = fs.readFileSync('18demo.txt').toString()
console.log(input)
//open ground (.), trees (|), or a lumberyard (#)

/*
An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.

An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards. Otherwise, nothing happens.

An acre containing a lumberyard will remain a lumberyard if it was adjacent to at least one other lumberyard and at least one acre containing trees. 
    Otherwise, it becomes open.
*/
const types = {
    '.': {label: 'open ground', render: '.', conversionReq:'|||', converTo: '|', sortOrder: 1},
    '|': {label: 'trees', render: '|', conversionReq: '###', convertTo: '#', sortOrder: 2},
    '#': {label: 'lumberyard', render: '#', conversionReq: '........', convertTo: '.', sortOrder: 3}
}



