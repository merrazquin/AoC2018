const fs = require('fs')
const SPRING_COL = 500
// const inputFile = '17.txt'
const inputFile = '17demo.txt'
let grid = []
var minX = null, maxX = null, minY = null, maxY = null

const types = {
    SPRING: { name: 'spring', display: '+' },
    SAND: { name: 'sand', display: '.' },
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
        if(this.type == types.CLAY || this.type == types.STANDING_WATER) throw new Error(`Cannot convert ${this.type.name} to ${this.type.name}`)

        this.type = type
    }

    isAccessible() {
        return this.type !== types.SPRING && this.type !== types.CLAY && this.type !== types.STANDING_WATER
    }

    toString() {
        return this.type.display
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
        grid[0][x] = new Square(x, 0, (x === SPRING_COL ? types.SPRING : types.SAND))
    }

    // fill in sand
    for (var y = 0; y <= maxY; y++) {
        if (!grid[y]) {
            grid[y] = []
        }
        for (var x = minX; x <= maxX; x++) {
            if (!grid[y][x]) {
                grid[y][x] = new Square(x, y, types.SAND)
            }
        }
    }
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

function flowWater() {
    var wetSquares = 0;
    var currentSquare = grid[1][SPRING_COL]
    console.log(currentSquare)
    while (currentSquare && currentSquare.type != types.CLAY && currentSquare.type != types.STANDING_WATER) {
        currentSquare.convertType(types.WET_SAND)
        if (currentSquare.y > minY && currentSquare.y < maxY) {
            wetSquares++
        }
        currentSquare = findNextSquare(currentSquare)
    }
}

function findNextSquare(curSquare) {
    var southSquare = grid[curSquare.y + 1][curSquare.x]
    var westSquare = grid[curSquare.y][curSquare.x - 1]
    var eastSquare = grid[curSquare.y][curSquare.x + 1]
    var northSquare = grid[curSquare.y - 1][curSquare.x]

    if(southSquare.isAccessible()) return southSquare;
    if(westSquare.isAccessible()) return westSquare;
    return null
}

generateGrid()
flowWater()
console.log(render())