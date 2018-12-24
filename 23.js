const fs = require('fs')

class Nanobot {
    constructor(x, y, z, radius) {
        this.x = x
        this.y = y
        this.z = z
        this.radius = radius
    }

    distanceTo(nanobot) {
        return manhattanDistance3D(this, nanobot)
    }
}

function manhattanDistance3D(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) + Math.abs(p1.z - p2.z)
}

var input = fs.readFileSync('23.txt').toString().trim().split(/\r{0,1}\n/)
    .map(point => {
        var settings = point.replace('pos=<', '').replace('>, r=', ',').split(',').map(val => parseInt(val))
        var [x, y, z, radius] = settings
        return new Nanobot(x, y, z, radius)
    })

function sortByPower(n1, n2) {
    return n2.radius - n1.radius
}

function findNanobotsInRange(target) {
    return input.filter(nanobot => target.distanceTo(nanobot) <= target.radius).length
}

function solveP1() {
    input.sort(sortByPower)
    var strongest = input[0]
    console.log('p1', findNanobotsInRange(strongest))
}

solveP1()
