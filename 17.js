const fs = require('fs')
var clay = [];
fs.readFileSync('17demo.txt').toString().trim().split('\n').forEach(entry => {
    var parsed = entry.split(', ').sort();
    var xParts = parsed[0].split('=')[1].split('..')
    var yParts = parsed[1].split('=')[1].split('..')

    var xMin = parseInt(xParts[0])
    var xMax = parseInt(xParts[1] || xParts[0])

    var yMin = parseInt(yParts[0])
    var yMax = parseInt(yParts[1] || yParts[0])

    console.log(xMin, xMax, yMin, yMax)
})
