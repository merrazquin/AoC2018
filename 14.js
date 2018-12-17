//12:28am
//first demo at 12:51am 
// all demos at 12:55am 
// p1 submission at 12:56 (28 min)

//p2 at 1:25am (29 min)
//solved for 01245 bug  at 2:08am

const LinkedList = require('linked-list'),
    inherits = require('inherits')

Recipes.prototype.join = join
Recipe.prototype.toString = toString
inherits(Recipes, LinkedList)
inherits(Recipe, LinkedList.Item)

function Recipes() {
    LinkedList.apply(this, arguments)
}
function Recipe(value) {
    this.value = value
    LinkedList.Item.apply(this, arguments)
}
function join(delimiter) {
    return this.toArray().join(delimiter)
}

function toString() {
    return this.value
}

let elf1 = new Recipe(3);
let elf2 = new Recipe(7);
let head = elf1;
let tail = elf2;
let recipeList = new Recipes(elf1, elf2);

//make circular
elf1.prev = elf2
elf2.next = elf1
/*51589 first appears after 9 recipes.
01245 first appears after 5 recipes.
92510 first appears after 18 recipes.
59414 first appears after 2018 recipes*/
function generateNewRecipe(p2 = false) {
    var newRecipeVal = elf1.toString() + elf2.toString()
    newRecipeVal.toString().split('').forEach(digit => {
        recipesMade++
        var newRecipe = new Recipe(parseInt(digit))
        tail.append(newRecipe)
        tail = newRecipe

        if (solvingP2) {
            if (currentString != targetString.substr(0, currentString.length)) {
                currentString = currentString.substr(-1)
            }

            currentString += digit;
            if (currentString === targetString) {
                console.log('p2', recipesMade - targetString.length)
            }
        }

    });

    var elf1val = elf1.toString() + 1;
    var elf2val = elf2.toString() + 1;
    while (elf1val) {
        elf1 = elf1.next
        elf1val--
    }

    while (elf2val) {
        elf2 = elf2.next
        elf2val--
    }

}

/*If the Elves think their skill will improve after making 9 recipes, the scores of the ten recipes after the first nine on the scoreboard would be
 5158916779 (highlighted in the last line of the diagram).
After 5 recipes, the scores of the next ten would be 0124515891.
After 18 recipes, the scores of the next ten would be 9251071085.
After 2018 recipes, the scores of the next ten would be 5941429882.*/

var recipesMade = 2;
var optimalRecipe = 824501;
var solvingP2 = true
var targetString = '030121'
// var targetString = '59414' // 2018
// var targetString = '01245'; // 5
// var targetString = '824501'; // PROD
var currentString = '37';

while ( (solvingP2 ? (currentString !== targetString) : (recipesMade <= (optimalRecipe + 11)))) {
    generateNewRecipe(solvingP2)
}

if (!solvingP2) {
    var str = '';
    var nthRecipe = head;
    while (optimalRecipe) {
        nthRecipe = nthRecipe.next
        optimalRecipe--
    }
    while (str.length < 10) {
        str += nthRecipe.value;
        nthRecipe = nthRecipe.next;
    }
    console.log(str)
}