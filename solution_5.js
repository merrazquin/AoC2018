const fs = require('fs')

let polymer = fs.readFileSync('input_5.txt').toString().trim()
console.log( typeof polymer)
function isReactive(a, b) {
    if(a === b) return false

    return a.toUpperCase() === b.toUpperCase() && !(isUpperCase(a) & isUpperCase(b))
}

function removeReactive(p) {
    let polymerArr = p.split('')
    let foundIndex = -1
    do {
        foundIndex = polymerArr.findIndex((val, index, arr) => {
            if(index === arr.length-1) return false
            return isReactive(val, arr[index+1])
        })
        if(foundIndex !== -1) {
            polymerArr.splice(foundIndex, 2)
        }
    } while(foundIndex !== -1)

    return polymerArr.join('')
}

function isUpperCase(char) {
    return char === char.toUpperCase()
}

const allUnits = 'abcdefghijklmnopqrstuvwxyz'.split('')
let shortestPolymer = polymer.length
console.log(polymer.length)


allUnits.forEach(val => {
    let testPolymer = polymer.split(val).join('').split(val.toUpperCase()).join()
    console.log('testing', val)
    shortestPolymer = Math.min(shortestPolymer, removeReactive(testPolymer).length)
})

console.log('shortest', shortestPolymer)
// let reactedPolymer = removeReactive(polymer)
// console.log('len', reactedPolymer.length)

// 13401 is too high