const fs = require('fs')
var grid = fs.readFileSync('18demo.txt').toString().split('\n').map(row => row.split(''))
var size = grid.length
console.log(size)
console.log(grid)
//open ground (.), trees (|), or a lumberyard (#)

/*
An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.

An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards. Otherwise, nothing happens.

An acre containing a lumberyard will remain a lumberyard if it was adjacent to at least one other lumberyard and at least one acre containing trees. 
    Otherwise, it becomes open.
*/
const types = {
    '.': { label: 'open ground', render: '.', conversionReq: '|||', converTo: '|', sortOrder: 1 },
    '|': { label: 'trees', render: '|', conversionReq: '###', convertTo: '#', sortOrder: 2 },
    '#': { label: 'lumberyard', render: '#', conversionReq: '........', convertTo: '.', sortOrder: 3 }
}
const sortVals = {
    '.': 1,
    '|': 2,
    '#': 3
}

class Acre {
    constructor(x, y, type) {
        this.x = x
        this.y = y
        this.type = types[type]
    }
    toString() {
        return this.type.render
    }
}

function getNeighbors(x, y) {
    var n, s, e, w, ne, se, nw, sw
    n = y > 0 ? grid[y - 1][x] : ''
    s = y < (size - 1) ? grid[y + 1][x] : ''
    e = x < (size - 1) ? grid[y][x + 1] : ''
    w = x > 0 ? grid[y][x - 1] : ''
    ne = n && e ? grid[y - 1][x + 1] : ''
    nw = n && w ? grid[y - 1][x - 1] : ''
    se = s && e ? grid[y + 1][x + 1] : ''
    sw = s && w ? grid[y + 1][x - 1] : ''

    return [n, s, e, w, ne, se, nw, sw].reduce((neighbors, val) => neighbors + val, '').split('').sort(neighborSort).join('')
}
function neighborSort(a, b) {
    return sortVals[a] - sortVals[b]
}
console.log('neighbors for', grid[0][2], getNeighbors(2, 0))



