//2:04pm - 2:32pm - figuring out the problem

const fs = require('fs')
const input = fs.readFileSync('6.txt').toString().trim().split('\n').map((point, index) => {
    const arr = point.split(', ').map(entry => parseInt(entry)), o = {};
    ({ 0: o.x, 1: o.y } = arr)
    o.id = index + 1
    return o
})
// return

const edges = computeEdges(),
    eligiblePoints = computeEligiblePoints()
function computeEdges() {
    var xs = input.map(point => point.x)
    var ys = input.map(point => point.y)
    return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) }
}

console.log(edges)

console.log('ineligible')
let ineligible = input.filter(point => !inBounds(point)).sort((a, b) => (a.x - b.x + a.y - b.y))
console.log(ineligible)
function computeEligiblePoints() {
    return input.filter(point => {
        return inBounds(point)
    }).map(point => point.id)
}

function inBounds(point) {
    return (point.x > edges.left && point.x < edges.right && point.x > edges.top && point.y < edges.bottom)
}

function manhattanDistance(pointA, pointB) {
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}


function findClosest(targetPoint) {
    //get distances from all points
    var distances = input.map(point => {
        return { point: point, distance: manhattanDistance(point, targetPoint) }
    })

    // if there are any ties, return false
    var distancesOnly = distances.map(val => val.distance)
    // if(!distancesOnly.every((val, index, arr) => arr.indexOf(val) === index)) return false

    distances.sort((a, b) => a.distance - b.distance)
    // console.log(distances)
    //find closest
    var closestPoint = distances.shift()

    //if there's a tie, return false, otherwise return closest
    return (closestPoint.distance !== distances[0].distance) ? closestPoint : false
}


var points = {}

var startX = edges.left + 1;
var startY = edges.top + 1;
var stopX = edges.right - 1;
var stopY = edges.bottom - 1;
for (var x = startX; x <= stopX; x++) {
    for (var y = startY; y <= stopY; y++) {
        var closest = findClosest({ x, y })
        if (closest && eligiblePoints.includes(closest.point.id)) {
            var label = closest.point.id
            if (!points[label]) {
                points[label] = 0
            }
            points[label]++
        }
    }
}
// console.log(points)

console.log(Object.values(points).sort((a, b) => a - b).pop())

//4452 is too high
//4503 is too high
//3785 is too high