
const fs = require('fs')
const input = fs.readFileSync('6.txt').toString().trim().split('\n').map((point, index) => {
    const arr = point.split(', ').map(entry => parseInt(entry)), o = {};
    ({ 0: o.x, 1: o.y } = arr)
    o.id = index + 1
    o.area = 0
    return o
})


function getEdges(input) {
    var xs = input.map(point => point.x)
    var ys = input.map(point => point.y)
    return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) }
}

function inBounds(point) {
    return (point.x > edges.left && point.x < edges.right && point.x > edges.top && point.y < edges.bottom)
}

function identifyInfinite() {
    //top & bottom edges
    for(var x = edges.left; x <= edges.right; x++) {
        var y = edges.top
        input.forEach(point => {
            if(findClosest({x,y}, true).point.id === point.id) point.area = Infinity
        })
        y = edges.bottom
        input.forEach(point => {
            if(findClosest({x,y}, true).point.id === point.id) point.area = Infinity
        })
    }

    //left & right edges
    for(var y = edges.top; y <= edges.bottom; y++) {
        var x = edges.left
        input.forEach(point => {
            if(findClosest({x,y}, true).point.id === point.id) point.area = Infinity
        })
        x = edges.right
        input.forEach(point => {
            if(findClosest({x,y}, true).point.id === point.id) point.area = Infinity
        })
    }
}

function computeFinitePoints() {
    return input.filter(point => inBounds(point)).map(point => point.id)
}

function computeInfinitePoints() {
    return input.filter(point => !inBounds(point)).sort((a, b) => manhattanDistance({ x: 0, y: 0 }, a) - manhattanDistance({ x: 0, y: 0 }, b)).map(point => point.x + '_' + point.y)
}

function findClosest(targetPoint, ignoreInfinite = false) {
    //get distances from all points
    var distances = input.map(point => {
        return { point: point, distance: manhattanDistance(point, targetPoint) }
    })

    distances.sort((a, b) => a.distance - b.distance)

    //find closest
    var closestPoint = distances.shift()

    //if there's a tie, return false, otherwise return closest
    return (closestPoint.distance !== distances[0].distance || ignoreInfinite) ? closestPoint : false
}

function manhattanDistance(pointA, pointB) {
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}

let edges = getEdges(input),
    startX = edges.left + 1,
    stopX = edges.right - 1,
    startY = edges.top + 1,
    stopY = edges.bottom - 1,
    finitePoints = computeFinitePoints()
infinitePoints = computeInfinitePoints()

var areas = []
for (var x = startX; x <= stopX; x++) {
    for (var y = startY; y <= stopY; y++) {
        areas.push(findDistanceArea({x,y}))
        let closest = findClosest({ x, y })
        if (closest) {// finitePoints.includes(closest.point.id)) {

            let matchingPoint = input.find(point => point.id === closest.point.id)
            if (matchingPoint && inBounds(matchingPoint)) {
                matchingPoint.area++
            }
        }
    }
}

areas.sort((b,a) => a-b)
console.log('areas.len', areas.length, areas[0] > areas[1])
console.log(areas.find(val => val < 32))
// 9998 is too low 
function findDistanceArea(targetPoint) {
    return input.map(point => manhattanDistance(targetPoint, point)).reduce((acc, val) => acc + val)
}

// console.log(findDistanceArea({x:4, y:3}))

identifyInfinite()
// console.log(input.sort((a, b) => a.area - b.area))