const fs = require('fs')
class Sample {
    constructor(before, after, instructions) {
        this.before = before
        this.after = after
        var [opcode, A, B, C] = instructions
        Object.assign(this, { opcode, A, B, C })
        this.possibleOperations = new Set()
    }
}

function performOp(op, before, A, B, C) {
    var result = before.slice()

    // find values based on operation
    var valA = before[A],
        valB = op.endsWith('r') ? before[B] : B

    // perform operation
    switch (op) {
        case 'addr':
        case 'addi':
            result[C] = valA + valB
            break;
        case 'mulr':
        case 'muli':
            result[C] = valA * valB
            break;
        case 'banr':
        case 'bani':
            result[C] = valA & valB
            break;
        case 'borr':
        case 'bori':
            result[C] = valA | valB
            break;
        case 'setr':
        case 'seti':
            valA = op === 'seti' ? A : before[A]
            result[C] = valA
            break;
        case 'gtir':
        case 'gtri':
        case 'gtrr':
            valA = op === 'gtir' ? A : before[A]
            result[C] = +(valA > valB)
            break;
        case 'eqir':
        case 'eqri':
        case 'eqrr':
            valA = op === 'eqir' ? A : before[A]
            result[C] = +(valA === valB)
    }
    return result
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
var opcodes = {
    0: 'bani',
    1: 'addr',
    2: 'mulr',
    3: 'addi',
    4: 'gtri',
    5: 'banr',
    6: 'borr',
    7: 'eqri',
    8: 'seti',
    9: 'eqrr',
    10: 'bori',
    11: 'setr',
    12: 'eqir',
    13: 'muli',
    14: 'gtrr',
    15: 'gtir'
}
// parse input
var fullInput = fs.readFileSync('16full.txt').toString().trim().split(/\r{0,1}\n\r{0,1}\n\r{0,1}\n\r{0,1}\n/)
var p1Samples = fullInput[0].split(/\r{0,1}\n\r{0,1}\n/).map(parseSample)
var p2Input = fullInput[1].split(/\r{0,1}\n/).map(entry => entry.split(' ').map(val => parseInt(val)))

function parseSample(definition) {
    var parsed = definition.split(/\r{0,1}\n/)
    var before = parsed[0].split(': [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    var instructions = parsed[1].split(' ').map(val => parseInt(val))
    var after = parsed[2].split(':  [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    return new Sample(before, after, instructions)
}

function performAllOperations(sample) {
    sample.possibleOperations = new Set()
    for (var key in operations) {
        var result = performOp(key, sample.before, sample.A, sample.B, sample.C).join('')
        // if the result of the operation matches the 'after', then this sample behaves like the opcode
        if (result === sample.after.join('')) {
            sample.possibleOperations.add(key)
            operations[key].add(sample.opcode)
        }
    }
    if (sample.possibleOperations.size >= 3) p1Total++
}

var p1Total = 0;
// for each sample, perform all possible operations
p1Samples.forEach(performAllOperations)
console.log(`P1: ${p1Total} out of ${p1Samples.length} samples have 3 or more possible operations`)
//556 is too low


/* WORKING demo */
var demo = parseSample(`Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`)
performAllOperations(demo)
console.log(`demo has ${demo.possibleOperations.size} possible operations: ${Array.from(demo.possibleOperations).join(', ')}`)

// speculative work for p2
// assignOpCodes(operations)
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
    } else {
        for (var key in operations) {
            if (typeof operations[key] === 'number') continue
            // console.log(key)
            for (let opcode of operations[key]) {
                var validated = p1Samples.filter(sample => sample.opcode === opcode).every(sample => sample.performOp(key).join('') === sample.after.join(''))
                if (validated) {
                    // console.log('   ', opcode, 'matches perfectly')
                }
            }
        }
    }
}

function removeOpCode(code, except) {
    for (var key in operations) {
        if (key !== except && typeof operations[key] !== 'number') {
            operations[key].delete(code)
        }
    }
}

function solveP2() {
    var registers = [0, 0, 0, 0]
    p2Input.forEach(instruction => {
        var [opcode, A, B, C] = instruction
        registers = performOp(opcodes[opcode], registers, A, B, C)        
    })
    console.log('p2:',registers)
}
solveP2()