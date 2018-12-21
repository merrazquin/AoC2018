const fs = require('fs')
class Operation {
    constructor(before, after, instructions) {
        this.before = before
        this.after = after
        var [opcode, A, B, C] = instructions
        Object.assign(this, { opcode, A, B, C })
        this.possibleOperations = new Set()
    }
    performOp(op) {
        var result = this.before.slice()

        // find values based on operation
        var valA = this.before[this.A],
            valB = op.endsWith('r') ? this.before[this.B] : this.B

        // perform operation
        switch (op) {
            case 'addr':
            case 'addi':
                result[this.C] = valA + valB
                break;
            case 'mulr':
            case 'muli':
                result[this.C] = valA * valB
                break;
            case 'banr':
            case 'bani':
                result[this.C] = valA & valB
                break;
            case 'borr':
            case 'bori':
                result[this.C] = valA | valB
                break;
            case 'setr':
            case 'seti':
                valA = op === 'seti' ? this.A : this.before[this.A]
                result[this.C] = valA
                break;
            case 'gtir':
            case 'gtri':
            case 'gtrr':
                valA = op === 'gtir' ? this.A : this.before[this.A]
                result[this.C] = +(valA > valB)
            case 'eqir':
            case 'eqri':
            case 'eqrr':
                valA = op === 'eqir' ? this.A : this.before[this.A]
                result[this.C] = +(valA === valB)
        }
        return result
    }
}

// generate a Set for each possible operation
var operations = [
    'addr', 'addi',
    'mulr', 'muli',
    'banr', 'bani',
    'borr', 'bori',
    'setr', 'seti',
    'gtir', 'gtri', 'gtrr',
    'eqir', 'eqri', 'eqrr'
].reduce((ops, op) => { ops[op] = new Set(); return ops }, {})

// parse input
var fullInput = fs.readFileSync('16full.txt').toString().trim().split(/\r{0,1}\n\r{0,1}\n\r{0,1}\n\r{0,1}\n/)
var p1Input = fullInput[0].split(/\r{0,1}\n\r{0,1}\n/).map(parseOperation)
var p2Input = fullInput[1].split(/\r{0,1}\n/).map(entry => entry.split(' ').map(val => parseInt(val)))

function parseOperation(definition) {
    var parsed = definition.split(/\r{0,1}\n/)
    var before = parsed[0].split(': [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    var instructions = parsed[1].split(' ').map(val => parseInt(val))
    var after = parsed[2].split(':  [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    return new Operation(before, after, instructions)
}

function performAllOperations(operation) {
    operation.possibleOperations = new Set()
    for (var key in operations) {
        var result = operation.performOp(key).join('')
        // if the result of the operation matches the 'after', then this sample behaves like the opcode
        if (result === operation.after.join('')) {
            operation.possibleOperations.add(key)
            operations[key].add(operation.opcode)
        }
    }
    if (operation.possibleOperations.size >= 3) p1Total++
}

var p1Total = 0;
// for each sample, perform all possible operations
p1Input.forEach(performAllOperations)
console.log('p1Total', p1Total)
//556 is too low


/* demo */
var demo = parseOperation(`Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`)
performAllOperations(demo)
console.log(`demo has ${demo.possibleOperations.size} possible operations: ${Array.from(demo.possibleOperations)}`)

// speculative work for p2
assignOpCodes(operations)
function assignOpCodes(operations) {
    var changed = false
    for (var key in operations) {
        if (typeof operations[key] === 'number') continue
        if (operations[key].size === 1) {
            var code = Array.from(operations[key])[0]
            removeOpCode(code, key)
            operations[key] = code
            changed = true
            break;
        }
    }
    if (changed) {
        assignOpCodes(operations)
    }
}
function removeOpCode(code, except) {
    for (var key in operations) {
        if (key !== except && typeof operations[key] !== 'number') {
            operations[key].delete(code)
        }
    }
}