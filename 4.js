const fs = require('fs')

var input = fs.readFileSync('4.txt');
var inputArr = JSON.parse(input);

function sortByDate(a, b) {
    const aDate = new Date(a.substr(1, 16)),
        bDate = new Date(b.substr(1, 16));

    return aDate - bDate;
}


// sort entries by date
inputArr.sort(sortByDate);
let currentGuard = -1;
let previousTime = null;
let guards = {}

for (let i = 0; i < inputArr.length; i++) {
    const entry = inputArr[i];
    let j;
    if (entry.includes('Guard')) {
        // new guard is taking a shift
        currentGuard = /#([0-9]+)/.exec(entry)[1]
        previousTime = new Date(entry.substr(1, 16))
        if (!guards[currentGuard]) {
            guards[currentGuard] = { awake: [], asleep: [] }
        }
    }
    else if (entry.includes('falls')) {
        // current guard has fallen asleep
        let currentTime = new Date(entry.substr(1, 16))
        // currentTime = new Date(currentTime.getTime() + 60000)
        let minutesAwake = (currentTime - previousTime)/1000

        for(j = previousTime; j < currentTime;) {
            guards[currentGuard].awake.push(j)
            j = new Date(j.getTime() + 60000)
        }
        previousTime = currentTime
    }
    else {
        // current guard has woken up
        let currentTime = new Date(entry.substr(1, 16)) 
        // currentTime = new Date(currentTime.getTime() - 60000)
        let minutesAsleep = (currentTime - previousTime)/1000

        for(j = previousTime; j < currentTime;) {
            guards[currentGuard].asleep.push(j)
            j = new Date(j.getTime() + 60000)
        }
    }
}

let maxMinutesAsleep = 0
let sleepiestGuard = -1
for(var guard in guards) {
    var guardSleepMin = guards[guard].asleep.map(val => val.getMinutes())

    var sleepMode = mode(guardSleepMin)
    var sleepModeFreq = guardSleepMin.filter(val => val === sleepMode).length
    console.log('guard', guard, 'mode', sleepMode, 'freq', sleepModeFreq)
  if(guards[guard].asleep.length > maxMinutesAsleep) {
    maxMinutesAsleep = guards[guard].asleep.length
      sleepiestGuard = guard
  }
  console.log(guards[guard].asleepMode)
}
console.log('sleepiest', sleepiestGuard)



let minutes = guards[sleepiestGuard].asleep.map(val => val.getMinutes())
// let mostCommonMinute = mode(minutes)
let mostCommonMinute = mode(minutes)
console.log('mostCommon', mostCommonMinute);
console.log('solution', (mostCommonMinute * sleepiestGuard))

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}