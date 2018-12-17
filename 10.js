// started at 6:58AM

const fs = require('fs'),
    input = fs.readFileSync('10prod.txt').toString().trim().split('\n').map(entry => {
        let parsed = entry.split('position=<').join('').split('> velocity=<').join(', ').split('>').join('').split(', ').map(num => parseInt(num))
        return { x: parsed[0], y: parsed[1], vx: parsed[2], vy: parsed[3], tx: parsed[0], ty: parsed[1] }
    })

//input pased at 7:03am
const numseconds = 3
input.forEach(point => {
    point.tx = point.x + (point.vx * numseconds)
    point.ty = point.y + (point.vy * numseconds)
})

function reset() {
    input.forEach(point => {
        point.tx = point.x
        point.ty = point.y
    })
}
function getEdges() {
    var xs = input.map(point => point.tx).sort(numericSort)
    var ys = input.map(point => point.ty).sort(numericSort)
    return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) }

}
var tickLen = 1
var total = 0
var width = 0, height = 0
function tick() {
    input.forEach(point => {
        point.tx += (point.vx * tickLen)
        point.ty += (point.vy * tickLen)
    })
    var edges = getEdges()
    width = edges.right - edges.left
    height = edges.bottom - edges.top
    total++

    return height
}
function backTick() {
    input.forEach(point => {
        point.tx -= (point.vx * tickLen)
        point.ty -= (point.vy * tickLen)
    })
    total--
}

// var minheight = height = tick()
tick()
var minheight = height, minwidth = width
// while (height <= minheight && width <= minwidth) {
while (height > 15) {
    tick()
}
// backTick()
console.log('done', total, width, height)

//10023 & 10024 & 10025 are too low

var edges = getEdges()
var str = ''
for (var y = edges.top; y <= edges.bottom; y++) {
    for (var x = edges.left; x <= edges.right; x++) {
        var found = input.find(point => point.tx === x && point.ty === y)
        str += found ? '#' : '.'
    }
    str += '\n'
}
fs.writeFileSync('10output.txt', str)

reset()
console.log(getEdges())
"######..#####...#####...#####...#####...#####...######....##.."
width = 0
total = 0
while(width != 61) {
    tick()
}
console.log('done', total)

var edges = getEdges()
var str = ''
for (var y = edges.top; y <= edges.bottom; y++) {
    for (var x = edges.left; x <= edges.right; x++) {
        var found = input.find(point => point.tx === x && point.ty === y)
        str += found ? '#' : '.'
    }
    str += '\n'
}
fs.writeFileSync('10output2.txt', str)

//demo printing at 7:14am
//starting print at 7:20am
//7:40 read height might be 10
//7:42 solved part 1
//break at 7:49am
//back at 8:02
//8:17 solved part 2

var numericSort = (a, b) => a - b