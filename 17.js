const fs = require('fs')
const SPRING_COL = 500
// const inputFile = '17.txt'
const inputFile = '17demo.txt'
let grid = []
var minX = null, maxX = null, minY = null, maxY = null

const types = {
    SPRING: { name: 'spring', display: '+' },
    DRY_SAND: { name: 'drySand', display: '.' },
    CLAY: { name: 'clay', display: '#' },
    WET_SAND: { name: 'wetSand', display: '|' },
    STANDING_WATER: { name: 'standingWater', display: '~' }
}

class Square {
    constructor(x, y, type) {
        this.x = x
        this.y = y
        this.type = type
    }

    convertType(type) {
        if (this.type == types.CLAY || this.type == types.STANDING_WATER) throw new Error(`Cannot convert ${this.type.name} to ${this.type.name}`)

        this.type = type
    }

    isAccessible() {
        return this.type !== types.SPRING && this.type !== types.CLAY && this.type !== types.STANDING_WATER
    }

    isConvertible() {
        return this.type === types.DRY_SAND || this.type === types.WET_SAND
    }

    toString() {
        return this.type.display
    }

    getNeighbor(direction) {
        var neighbor
        switch (direction) {
            case 'south':
                neighbor = this.southNeighbor
                break;
            case 'north':
                neighbor = this.northNeighbor
                break;
            case 'east':
                neighbor = this.eastNeighbor
                break;
            case 'west':
                neighbor = this.westNeighbor
                break;
        }
        return neighbor
    }

    isBlocked() {
        return (this.northNeighbor && !this.northNeighbor.isConvertible()) ||
            (this.southNeighbor && !this.southNeighbor.isConvertible()) ||
            (this.eastNeighbor && !this.eastNeighbor.isConvertible()) ||
            (this.westNeighbor && !this.westNeighbor.isConvertible())
    }
}

function generateGrid() {

    // add clay
    fs.readFileSync(inputFile).toString().trim().split('\n').forEach(entry => {
        var parsed = entry.split(', ').sort()
        var xParts = parsed[0].split('=')[1].split('..')
        var yParts = parsed[1].split('=')[1].split('..')

        var xMin = parseInt(xParts[0])
        var xMax = parseInt(xParts[1] || xParts[0])

        var yMin = parseInt(yParts[0])
        var yMax = parseInt(yParts[1] || yParts[0])

        minX = Math.min(xMin, minX || xMin)
        maxX = Math.max(xMax, maxX || xMax)

        minY = Math.min(yMin, minY || yMin)
        maxY = Math.max(yMax, maxY || yMax)

        for (var x = xMin; x <= xMax; x++) {
            for (var y = yMin; y <= yMax; y++) {
                if (!grid[y]) grid[y] = []
                grid[y][x] = new Square(x, y, types.CLAY)
            }
        }
    })

    // add spring
    if (!grid[0]) {
        grid[0] = []
    }
    for (var x = minX; x <= maxX; x++) {
        grid[0][x] = new Square(x, 0, (x === SPRING_COL ? types.SPRING : types.DRY_SAND))
    }

    // fill in sand
    for (var y = 0; y <= maxY; y++) {
        if (!grid[y]) {
            grid[y] = []
        }
        for (var x = minX; x <= maxX; x++) {
            if (!grid[y][x]) {
                grid[y][x] = new Square(x, y, types.DRY_SAND)
            }
        }
    }

    generateNeighbors()
}

function generateNeighbors() {
    grid.forEach(row => row.forEach(square => {
        square.northNeighbor = grid[square.y - 1] ? grid[square.y - 1][square.x] : null
        square.southNeighbor = grid[square.y + 1] ? grid[square.y + 1][square.x] : null
        square.eastNeighbor = grid[square.y][square.x + 1]
        square.westNeighbor = grid[square.y][square.x - 1]
    }))
}

function countWetTiles() {
    return grid.reduce((wetCount, row, rowIndex) => {
        // only count rows between minY & maxY
        return wetCount + (rowIndex > minY && rowIndex < maxY ? row.filter(square => square.type === types.WET_SAND || square.type === types.STANDING_WATER).length : 0)
    }, 0)
}

function render() {
    return grid.reduce((rowAcc, row) => rowAcc + row.reduce((colAcc, square) => colAcc + square, '') + '\n', '')
}

function flowWater(direction, prevSquare) {
    var currSquare = prevSquare.getNeighbor(direction)
    while (currSquare && currSquare.isConvertible()) {
        currSquare.convertType(currSquare.isBlocked ? types.STANDING_WATER : types.WET_SAND)
        var nextSquare = currSquare.getNeighbor(direction)
        prevSquare = currSquare
        currSquare = nextSquare //currSquare.getNeighbor(direction)
    }
    if (direction === 'south' && currSquare.isBlocked()) {
        flowWater('east', prevSquare)
        flowWater('west', prevSquare)
    }

}


function findNextSquare(currSquare) {
    var southSquare = grid[currSquare.y + 1][currSquare.x]
    var westSquare = grid[currSquare.y][currSquare.x - 1]
    var eastSquare = grid[currSquare.y][currSquare.x + 1]
    var northSquare = grid[currSquare.y - 1][currSquare.x]

    if (southSquare.isAccessible()) return southSquare;
    if (westSquare.isAccessible()) return westSquare;
    // if(eastSquare.isAccessible()) return eastSquare;
    // if(northSquare.isAccessible()) return northSquare;
    return null
}

function branch(currSquare) {
    flowWater('west', currSquare)
    flowWater('east', currSquare)
}

generateGrid()
flowWater('south', grid[0][SPRING_COL])
console.log(render())