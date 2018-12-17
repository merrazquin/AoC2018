const fs = require('fs')
let clay = []
var minX = null, maxX = null, minY = null, maxY = null

fs.readFileSync('17demo.txt').toString().trim().split('\n').forEach(entry => {
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
            clay.push({ x, y })
        }
    }
})

function render() {
    //render fountain
    var y = 0
    var str = ''
    for(var x = minX; x <= maxX; x++) {
        str += x === 500 ? '+' : '.'
    }
    console.log(str)

    //render clay & sand
    for (var y = minY; y <= maxY; y++) {
        str = ''
        for (var x = minX; x <= maxX; x++) {
            str += clay.find(entry => entry.x == x && entry.y == y) ? '#' : '.'
        }
        console.log(str)
    }
}

render()
