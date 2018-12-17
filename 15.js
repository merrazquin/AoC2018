const fs = require('fs');

var input = fs.readFileSync('15demo.txt').toString().split('\n').map(row => row.split(''))

console.log(input)

class Unit {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type
    }
}

class Elf extends Unit {
    constructor(x, y) {
        super(x, y, 'E')
    }
}

class Goblin extends Unit {
    constructor(x, y) {
        super(x, y, 'G')
    }
}