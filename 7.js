//starting at 11:34am on 12/9
//lunch at 12:20pm
//p1 solved at 12:27pm
//starting p2 at 12:40pm
// break at 1:22pm
//back at 1:28pm
//solved at 1:42

//p2 test CABFDE

const fs = require('fs')
const input = fs.readFileSync('7.txt').toString().trim().split('\n')
const timeModifier = 61
const numWorkers = 5

let workers = []
for(var i = 1; i <= numWorkers; i++) workers.push({ id: i, action: null })

let dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, index) => {
    return { action: letter, prerequisites: [], active: false, resolved: false, timeToComplete: index + timeModifier, inProgress: false }
})

function parseEntry(entry) {
    const parsed = {}
    const parseArr = /Step ([A-Z]).*step ([A-Z]) /.exec(entry)
    parsed.action = parseArr[2]
    parsed.prerequisite = parseArr[1]

    return parsed
}

input.forEach(entry => {
    let parsed = parseEntry(entry)
    let obj = dict[parsed.action.charCodeAt(0) - 65]
    let prereqObj = dict[parsed.prerequisite.charCodeAt(0) - 65]

    obj.active = true
    prereqObj.active = true
    obj.prerequisites.push(parsed.prerequisite)
    obj.prerequisites.sort()
})
dict = dict.filter(entry => entry.active)
// console.log(dict)

var str = ''

function findNextAction() {
    return dict.find(entry => !entry.resolved && !hasPrereqs(entry))
}

function findAllActions() {
    return dict.filter(entry => !entry.resolved && !entry.inProgress && !hasPrereqs(entry))
}

function findAvailableWorker() {
    return workers.find(worker => !worker.action || !worker.action.timeToComplete)
}

function hasPrereqs(entry) {
    let prereqs = entry.prerequisites
    if (!prereqs.length) return false

    return !prereqs.every(letter => dict[letter.charCodeAt(0) - 65].resolved)
}

let secondsElapsed = 0
console.log('')
function tick() {
    let availableActions = findAllActions()
    workers.forEach(worker => {
        if (availableActions.length && !worker.action) {
            worker.action = availableActions.shift()
            worker.action.inProgress = true
        }
        if (worker.action) {
            worker.action.timeToComplete--
            if (worker.action.timeToComplete <= 0) {
                worker.action.resolved = true
                str += worker.action.action
                worker.action.inProgress = false
                worker.action = undefined
            }
        }

    })
    // workers.forEach(worker => worker.action && console.log('worker ', worker.id, 'working on', worker.action.action, 'with', worker.action.timeToComplete, 'seconds remaining'))
    secondsElapsed++
}

while(!dict.every(entry => entry.resolved)) {
    tick()
}

console.log('seconds elapsed', secondsElapsed)
console.log(str)

//225 is too low
//234 is too low
//258 is too low
//1056 correct