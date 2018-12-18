const fs = require('fs')

/*
. - open 
| - trees
# - lumberyard

An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.

An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards. Otherwise, nothing happens.

An acre containing a lumberyard will remain a lumberyard if it was adjacent to at least one other lumberyard and at least one acre containing trees. 
    Otherwise, it becomes open.
*/

const types = {
    '.': { render: '.', conversionReq: '|||', conversion: '|' },
    '|': { render: '|', conversionReq: '###', conversion: '#' },
    '#': { render: '#', conversionReq: '|#', conversion: '.', opposite: true }
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

var grid = fs.readFileSync('18.txt').toString().trim().split('\r\n').map(
    (row, rowIndex) => {
        return row.split('').map((acre, colIndex) => {
            return new Acre(colIndex, rowIndex, acre)
        })
    }
)
var size = grid.length


function getNeighbors(acre) {
    var x = acre.x, y = acre.y
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

function tick(oldGrid) {
    var newGrid = []
    for (var y = 0; y < size; y++) {
        if (!newGrid[y]) newGrid[y] = []
        for (x = 0; x < size; x++) {
            var currAcre = oldGrid[y][x]
            var isConverting = getNeighbors(currAcre).includes(currAcre.type.conversionReq)
            if (currAcre.type.opposite) {
                isConverting = !isConverting
            }

            var newType = isConverting ? currAcre.type.conversion : currAcre.toString()
            newGrid[y][x] = new Acre(x, y, newType)
        }
    }
    return newGrid
}

function render(grid, print = false) {
    var str = ''
    grid.forEach((row, rowIndex) => str += (rowIndex + '   ' + row.join('') + '\n'))
    if (print) console.log(str)
    return str
}

function part1Solution(grid) {
    var printedGrid = render(grid).split('')

    var wooded = printedGrid.filter(val => val === '|').length;
    var lumberYards = printedGrid.filter(val => val === '#').length
    return wooded * lumberYards
}
var grids = {}
grids[render(grid)] = [-1]

var target = 1000000000
for (var i = 0; i < target; i++) {
    var newGrid = tick(grid)
    var key = render(newGrid)

    if (!grids[key]) {
        grids[key] = []
    }

    if (i === 9) {
        console.log('p1', part1Solution(newGrid))
    }

    grids[key].push(i)

    if (grids[key].length > 1) {
        var repeat = Math.abs(grids[key].reduce((acc, val) => acc - val), 0)
        var pattern = grids[key][0] + ((target - grids[key][0]) % repeat) - 1
        for (var gridKey in grids) {
            if (grids[gridKey].includes(pattern)) {
                var wooded = gridKey.split('').filter(val => val === '|').length;
                var lumberYards = gridKey.split('').filter(val => val === '#').length
                console.log('p2', wooded * lumberYards)
                target = i
                break;
            }
        }
    }
    grid = newGrid
}