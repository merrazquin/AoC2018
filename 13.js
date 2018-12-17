const fs = require('fs')

var input = fs.readFileSync('13.txt').toString().split('\n').map(row => row.split(''));
var height = input.length;
var width = input[0].length;

const segmentTypes = {
    '-': { x: true, y: false },
    '|': { y: true, x: false },
    '/': { rotate: true },
    '\\': { rotate: true },
    '+': { intersection: true }
}

const cartConfigs = {
    '>': { x: true, y: false, xOrientation: 1, yOrientation: 0, trackSegment: '-' },
    '<': { x: true, y: false, xOrientation: -1, yOrientation: 0, trackSegment: '-' },
    '^': { x: false, y: true, xOrientation: 0, yOrientation: -1, trackSegment: '|' },
    'v': { x: false, y: true, xOrientation: 0, yOrientation: 1, trackSegment: '|' }
}

class TrackSegment {
    constructor(segmentType, x, y, occupied = false) {
        this.segmentType = segmentType;
        this.x = x;
        this.y = y;
        this.occupied = false;
        this.move = segmentTypes[segmentType]
        this.occupied = occupied
        this.currentCart = null;
    }
}

class Cart {
    constructor(id, config, x, y) {
        // xOrientation: -1 for left, 0 for none, 1 for right
        // yOrientation: -1 for up, 0 for none, 1 for down
        this.id = id;
        this.direction = { x: config.x, y: config.y };
        this.xOrientation = config.xOrientation;
        this.yOrientation = config.yOrientation;
        this.x = x;
        this.y = y;
        this.turns = ['left', 'forward', 'right'];
        this.alive = true
    }

    tick(trackSegment) {
        switch (trackSegment.segmentType) {
            case ('/'):

                if (this.direction.y) this.turnRight()
                else this.turnLeft()
                this.moveForward(this.direction)

                break;
            case ('\\'):

                if (this.direction.x) this.turnRight()
                else this.turnLeft()
                this.moveForward(this.direction)

                break;
            case ('-'):
            case ('|'):
                this.moveForward(trackSegment.move)
                break;
            case ('+'):
                var movement = this.turns.shift();
                this.turns.push(movement);

                if (movement == 'left') this.turnLeft();
                else if (movement == 'right') this.turnRight();
                this.moveForward(this.direction)
                break;
        }
        return this.getPosition();
    }
    turnLeft() {
        if (this.xOrientation * this.direction.x) {
            this.yOrientation = (this.xOrientation * this.direction.x) * -1;
            this.xOrientation = 0;
        }
        else if (this.yOrientation * this.direction.y) {
            this.xOrientation = (this.yOrientation * this.direction.y);
            this.yOrientation = 0;
        }
        this.direction.x = !this.direction.x;
        this.direction.y = !this.direction.y;
    }
    turnRight() {
        if (this.xOrientation * this.direction.x) {
            this.yOrientation = (this.xOrientation * this.direction.x);
            this.xOrientation = 0;
        }
        if (this.yOrientation * this.direction.y) {
            this.xOrientation = (this.yOrientation * this.direction.y) * -1;
            this.yOrientation = 0;
        }

        this.direction.x = !this.direction.x;
        this.direction.y = !this.direction.y;
    }
    moveForward(modifier) {
        this.x += ((this.direction.x && modifier.x) * this.xOrientation);
        this.y += ((this.direction.y && modifier.y) * this.yOrientation);
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }
    toString() {
        return `${this.id}: ${this.x}, ${this.y}. xOr: ${this.xOrientation} xDir: ${this.direction.x}, yOr: ${this.yOrientation} yDir: ${this.direction.y}`
    }
    render() {
        if (this.direction.x) return this.xOrientation == -1 ? '<' : '>'
        return this.yOrientation == -1 ? '^' : 'v'
    }
}

function createTracksAndCarts(input) {
    let tracks = {}, carts = []

    let id = 1;
    for (var y = 0; y < input.length; y++) {
        var row = input[y];
        for (var x = 0; x < row.length; x++) {
            var col = row[x];
            if (col === ' ') continue;
            if (segmentTypes[col]) {
                // it's a track segment
                tracks[`${x}_${y}`] = new TrackSegment(col, x, y, false)
            } else {
                // it's a cart
                var cartConfig = cartConfigs[col]
                carts.push(new Cart(id++, cartConfig, x, y))
                tracks[`${x}_${y}`] = new TrackSegment(cartConfig.trackSegment, x, y, true)
            }
        }
    }

    return { tracks, carts };
}

function cartSort(cartA, cartB) {
    return (cartA.y - cartB.y) + (cartA.x - cartB.x);
}

function showBoard(tracks, carts) {
    console.log(carts.map(cart => cart.id+": "+cart.render()))
    for (var y = 0; y < height; y++) {
        var row = ''
        for (var x = 0; x < width; x++) {
            if (!tracks[`${x}_${y}`]) {
                row += ' '
                continue;
            }
            var cart = carts.find(cart => cart.x == x && cart.y == y)
            row += cart && cart.alive ? cart.id : tracks[`${x}_${y}`].segmentType
        }
        console.log(row)
    }
    console.log('\n' + '*'.repeat(width) + '\n')
}

var { tracks, carts } = createTracksAndCarts(input)
function tick(carts, tracks) {
    var collision = false;
    carts.forEach(cart => {
        if(!cart.alive) return
        var currentSegment = tracks[`${cart.x}_${cart.y}`];
        currentSegment.occupied = false
        currentSegment.currentCart = null

        cart.tick(currentSegment)
        var newSegment = tracks[`${cart.x}_${cart.y}`];
        if (newSegment.occupied) {
            collision = true;
            newSegment.occupied = newSegment.currentCart.alive = cart.alive = false;
        } else {
            newSegment.occupied = true
            newSegment.currentCart = cart;
        }
    })
    return collision;
}
do {
    carts.sort(cartSort);
    tick(carts, tracks)
    carts = carts.filter(cart => cart.alive)

} while (carts.length > 1)

console.log('last remaining cart\n', carts[0])
