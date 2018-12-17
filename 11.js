//start at 5:31
//break at 5:34
//back at 5:38
//p1 solved at 6:13

const serial = 7689, gridSize = 300;
var allSquares = {}

function generateGrid(gridSize) {
    let grid = {};
    for (let x = 0; x < gridSize; x++) {
        var row = []
        for (let y = 0; y < gridSize; y++) {
            grid[`${x}_${y}`] = { x: x, y: y, power: findPower(x, y) }
        }
    }
    return grid;
}

let grid = generateGrid(gridSize)

// console.log('3x3', findSolution(3))
// console.log('4x4', findSolution(4))
function findMaxSolution(start, stop) {
    var solutions = []

    for (let size = start; size <= stop; size++) {
        console.log('finding solution for', size)
        solutions.push(Object.assign({ size: size }, findSolution(size)))
    }
    return solutions.sort((a, b) => b.total - a.total)[0]
}
console.log(findMaxSolution(1, 300))

function findSolution(squareSize) {

    // create a new array of eligible grid objects
    var eligible = Object.values(grid).filter(obj => {
        return obj.x < (gridSize - squareSize) && obj.y < (gridSize - squareSize)
    })
    let totals = [];
    eligible.forEach(obj => {
        // console.log('   ', obj)
        totals.push(Object.assign({ total: getSquareTotal(obj.x, obj.y, squareSize) }, obj))
    });
    let solution = totals.sort((a, b) => b.total - a.total)[0]
    return solution// Object.values(grid).sort((a, b) => b.total - a.total)[0]
}


function getSquareTotal(x, y, squareSize = 3) {
    let key = `${x}_${y}_${squareSize}`;
    // if the value already exists, 
    if (allSquares[key]) return allSquares[key];

    let prevKey = `${x}_${y}_${squareSize-1}`
    let total = 0;
    if (allSquares[prevKey]) {
        // console.log('found previous')
        total += allSquares[prevKey];
        for (let py = y; py < y + squareSize; py++) {
            if (!grid[`${x+squareSize}_${py}`]) continue
            total += grid[`${x+squareSize}_${py}`].power
        }
        for(let px = x; px < x + squareSize-1; px++) {
            if (!grid[`${px}_${y+squareSize}`]) continue
            total += grid[`${px}_${y+squareSize}`].power
        }
    } else {
        for (let px = x; px < x + squareSize; px++) {
            for (let py = y; py < y + squareSize; py++) {
                if (!grid[`${px}_${py}`]) continue
                total += grid[`${px}_${py}`].power
            }
        }
    }

    allSquares[key] = total;
    return total;
}

function findPower(x, y) {
    // Find the fuel cell's rack ID, which is its X coordinate plus 10.
    let rack = x + 10;
    // Begin with a power level of the rack ID times the Y coordinate.
    let power = rack * y;
    // Increase the power level by the value of the grid serial number (your puzzle input).
    power += serial;
    // Set the power level to itself multiplied by the rack ID.
    power *= rack;
    // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
    power = power < 100 ? 0 : parseInt(power.toString().split('').reverse()[2]);
    // Subtract 5 from the power level.
    return power - 5;
}


