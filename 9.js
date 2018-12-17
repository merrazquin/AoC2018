const LinkedList = require('linked-list'),
    inherits = require('inherits')

Marbles.prototype.join = join
Marble.prototype.toString = toString
inherits(Marbles, LinkedList)
inherits(Marble, LinkedList.Item)

function Marbles() {
    LinkedList.apply(this, arguments)
}
function Marble(value) {
    this.value = value
    LinkedList.Item.apply(this, arguments)
}
function join(delimiter) {
    return this.toArray().join(delimiter)
}

function toString() {
    return this.value
}

const players = {}

let currentPlayer = 1,
    numPlayers = 466,
    numMarbles = (71436 * 100),
    currentMarble = new Marble(0),
    marbleList = new Marbles(currentMarble)

currentMarble.prev = currentMarble
currentMarble.next = currentMarble


function takeTurn(player, marbleNumber) {
    if (marbleNumber && !(marbleNumber % 23)) {
        if (!players[player]) {
            players[player] = 0
        }
        players[player] += marbleNumber


        let removeMarble = currentMarble.prev.prev.prev.prev.prev.prev.prev
        currentMarble = removeMarble.next
        players[player] += removeMarble.detach().toString()

        return
    }

    let newMarble = new Marble(marbleNumber)
    let insertionPointMarble = currentMarble.next == currentMarble ? currentMarble : currentMarble.next

    insertionPointMarble.append(newMarble)
    currentMarble = newMarble
}

function playGame(numPlayers, numMarbles) {
    for (var i = 1; i <= numMarbles; i++) {
        takeTurn(currentPlayer, i);
        currentPlayer++
        if (currentPlayer > numPlayers) {
            currentPlayer = 1
        }
    }

    return Object.values(players).sort((a, b) => b - a)[0]
}

console.log('winner', playGame(numPlayers, numMarbles))

function debugCircle() {
    var testMarble = currentMarble
    var str = testMarble.toString()
    while (testMarble.next != currentMarble) {
        str += ' ' + testMarble.next.toString()
        testMarble = testMarble.next
    }
    console.log('-'.repeat(25))
    console.log(currentMarble.toString())
    console.log(str)
    console.log('-'.repeat(25))
}