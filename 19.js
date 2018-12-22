const fs = require('fs')

var input = fs.readFileSync('19.txt').toString().trim().split(/\r{0,1}\n/)
var ip = 0;
var boundRegister = parseInt(input.shift().split(' ').pop())
var instructions = input.map(instruction => {
    var [op, A, B, C] = instruction.split(' ').map((val, index) => !index ? val : parseInt(val))
    return {op, A, B, C}
})
var registers = new Array(6).fill(0)
console.log('starting at instruction', ip, 'ip is bound to register', boundRegister)

while(ip < instructions.length) {
    // execute instruction at ip
    var instruction = instructions[ip]
    registers[boundRegister] = ip
    registers = performOp(instruction, registers)
    ip = registers[boundRegister] + 1
}
console.log('p1', registers)

// performOp function fro day 16
function performOp(instruction, before) {
    var {op, A, B, C} = instruction
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