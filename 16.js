const fs = require('fs')
class Operation {
    constructor(before, after, instruction) {
        this.before = before
        this.after = after
        var parsedInstruction = instruction.split(' ').map(val => parseInt(val))
        this.opcode = parsedInstruction[0]
        this.A = parsedInstruction[1]
        this.B = parsedInstruction[2]
        this.C = parsedInstruction[3]
        this.possibleOperations = 0
    }
    performOp(op) {
        var result = this.before.slice()
        var opA = this.before[this.A],
            opB = op.endsWith('r') ? this.before[this.B] : this.B
        switch (op) {
            case 'addr':
            case 'addi':
                result[this.C] = opA + opB
                break;
            case 'mulr':
            case 'muli':
                result[this.C] = opA * opB
                break;
            case 'banr':
            case 'bani':
                result[this.C] = opA & opB
                break;
            case 'borr':
            case 'bori':
                result[this.C] = opA | opB
                break;
            case 'setr':
            case 'seti':
                opA = op === 'seti' ? this.A : this.before[this.A]
                result[this.C] = opA
                break;
            case 'gtir':
            case 'gtri':
            case 'gtrr':
                opA = op.charAt(2) === 'r' ? this.before[this.A] : this.A
                result[this.C] = +(opA > opB)
            case 'eqir':
            case 'eqri':
            case 'eqrr':
                opA = op.charAt(2) === 'r' ? this.before[this.A] : this.A
                result[this.C] = +(opA === opB)
        }
        return result
    }
}
var operations = {
    'addr': new Set(),
    'addi': new Set(),
    'mulr': new Set(),
    'muli': new Set(),
    'banr': new Set(),
    'bani': new Set(),
    'borr': new Set(),
    'bori': new Set(),
    'setr': new Set(),
    'seti': new Set(),
    'gtir': new Set(),
    'gtri': new Set(),
    'gtrr': new Set(),
    'eqir': new Set(),
    'eqri': new Set(),
    'eqrr': new Set()
}

// var input = fs.readFileSync('16.1.txt').toString().trim().split(/\r{0,1}\n\r{0,1}\n/).map(parseOperation)
var input = fs.readFileSync('16full.txt').toString().trim().split(/\r{0,1}\n\r{0,1}\n\r{0,1}\n\r{0,1}\n/)[0].split(/\r{0,1}\n\r{0,1}\n/).map(parseOperation)

function parseOperation(instructions) {
    var parsed = instructions.split(/\r{0,1}\n/)
    var before = parsed[0].split(': [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    var instruction = parsed[1]
    var after = parsed[2].split(':  [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    return new Operation(before, after, instruction)
}

var p1Total = 0;
function performAllOperations(operation) {
    operation.possibleOperations = 0
    console.log(operation.before)
    for (var key in operations) {
        var result = operation.performOp(key).join('')
        console.log(key, result)
        if (result === operation.after.join('')) {
            operation.possibleOperations++
            operations[key].add(operation.opcode)
        }
    }
    if (operation.possibleOperations >= 3) p1Total++
    console.log(operation.after)
    console.log('*'.repeat(10))
}


input.forEach(performAllOperations)
console.log('p1', input.filter(operation => operation.possibleOperations >= 3).length)
console.log('p1Total', p1Total)
//556 is too low
console.log(input.length)
var testOp = new Operation([0, 1, 2, 3], [0, 1, 2, 3], '0 1 2 0')
/*
addr 3
addi 3
mulr 
*/
console.log(testOp)
// performAllOperations(testOp)