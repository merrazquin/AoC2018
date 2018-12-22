const fs = require('fs')

var input = fs.readFileSync('22.txt').toString().trim().split(/\r{0,1}\n/)
//demo overrides
var depth = 11541// 510;
var target = {x: 14, y:778} //{ x: 10, y: 10 }
var regions = {'0_0': {geoIndex: 0, erosionLevel: depth % 20183}}
regions['0_0'].type = regions['0_0'].erosionLevel % 3
regions['14_778'] = regions['0_0']

function getGeologicIndex(x, y) {
    var key = `${x}_${y}`
    var watch = x=== 10 && y === 9
    if(!regions[key]) {
        regions[key] = {}
    } else if(regions[key].geoIndex != undefined) return regions[key].geoIndex

    var val;
    if(!x && !y) val = 0 // mouth
    else if(x === target.x && y === target.y) val = 0 // target
    else if(y === 0) val = x * 16807
    else if(x === 0) val = y * 48271
    else val = getErosionLevel(x-1, y) * getErosionLevel(x, y-1)

    regions[key].geoIndex = val;
    return val
}

function getErosionLevel(x, y) {
    var key = `${x}_${y}`
    if(!regions[key]) {
        regions[key] = {}
    } else if(regions[key].erosionLevel != undefined) return regions[key].erosionLevel

    var erosionLevel;
    if(regions[key].geoIndex != undefined) {
        erosionLevel = regions[key].erosionLevel = (regions[key].geoIndex + depth) % 20183
        var type = regions[key].type = erosionLevel % 3
        if(x <= target.x && y <= target.y) risk += type
        switch(type) {
            case 0:
                regions[key].typeLabel = '.'
                break;
            case 1:
                regions[key].typeLabel = '='
                break;
            case 2: 
                regions[key].typeLabel = '|'
        }
        return erosionLevel
    } else {
        getGeologicIndex(x, y)
        getErosionLevel(x, y)
    }
}
var risk = 0;
for(var y = 0; y <= target.y + 5; y++) {
    for(var x = 0; x <= target.x + 5; x++) {
        getGeologicIndex(x, y)
    }
}
console.log('total risk:',risk)
