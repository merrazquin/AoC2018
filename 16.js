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
    }
}
var input = fs.readFileSync('16.1.txt').toString().trim().split(/\r{0,1}\n\r{0,1}\n/).map(instructions => {
    var parsed = instructions.split(/\r{0,1}\n/)
    var before = parsed[0].split(': [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    var instruction = parsed[1]
    var after = parsed[2].split(':  [')[1].replace(']', '').split(', ').map(val => parseInt(val))
    return new Operation(before, after, instruction)
})
console.log(input)