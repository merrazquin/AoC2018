const fs = require('fs')
let input = fs.readFileSync('5.txt').toString().trim();
console.log(input.length)
function areReactive(a, b) {
  if (a === b || [a, b].every(isUpperCase)) {
    return false;
  }

  return (a.toLowerCase() === b.toLowerCase() && !(isUpperCase(a) & isUpperCase(b)))
}

function isUpperCase(letter) {
  return letter === letter.toUpperCase()
}

function removeReactive(input) {
  var inputArr = input.split('');
  console.log('removeReactive called on input of len', inputArr.length)
  var foundIndex = inputArr.findIndex((val, index, arr) => {
    if (index === arr.length - 1) return false;

    return areReactive(val, arr[index + 1])
  })
  if (foundIndex == -1) {
    return input;
  }
  else {
    inputArr.splice(foundIndex, 2);
    return removeReactive(inputArr.join(''))
  }
}

function findReactive(input) {
  var inputArr = input.split('');
  var foundIndex = inputArr.findIndex((val, index, arr) => {
    if (index === arr.length - 1) return false;

    return areReactive(val, arr[index + 1])
  })
  return foundIndex;
}

let allUnits = 'abcdefghijklmnopqrstuvwxyz'.split('')
let minLen = input.length
allUnits.forEach(letter => {
  console.log(letter)
  let currentInput = input.split('')
  currentInput = currentInput.filter(val => (val.toLowerCase() !== letter))
  currentInput = currentInput.join('')

  var foundIndex = findReactive(currentInput);
  while (foundIndex != -1) {
    currentInput = currentInput.split('');
    currentInput.splice(foundIndex, 2);
    currentInput = currentInput.join('')

    foundIndex = findReactive(currentInput)
  }
  minLen = Math.min(minLen, currentInput.length)
});

console.log('minLen:', minLen)
