const fs = require('fs')
// const inputFile = '17.txt'
const inputFile = '17demo.txt'
let grid = []
var minX = null, maxX = null, minY = null, maxY = null

const squareTypes = {
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
        this.type = type
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
                grid[y][x] = new Square(x, y, squareTypes.CLAY)
            }
        }
    })

    // add spring
    if (!grid[0]) {
        grid[0] = []
    }
    for (var x = minX; x <= maxX; x++) {
        grid[0][x] = new Square(x, 0, (x === 500 ? squareTypes.SPRING : squareTypes.SAND))
    }

    // fill in sand
    for (var y = 0; y <= maxY; y++) {
        if (!grid[y]) {
            grid[y] = []
        }
        for (var x = minX; x <= maxX; x++) {
            if (!grid[y][x]) {
                grid[y][x] = new Square(x, y, squareTypes.SAND)
            }
        }
    }
}

function countWetTiles() {
    return grid.reduce((wetCount, row, rowIndex) => {
        // only count rows between minY & maxY
        return wetCount + (rowIndex > minY && rowIndex < maxY ? row.filter(square => square.type === squareTypes.WET_SAND || square.type === squareTypes.STANDING_WATER).length : 0)
    }, 0)
}

function render() {
    return grid.reduce((rowAcc, row) => rowAcc + row.reduce((colAcc, square) => colAcc + square, '') + '\n', '')
}

function flowWater() {
    
}

generateGrid()