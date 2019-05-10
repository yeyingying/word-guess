


let gameWords = ["let", "this", "long", "package", "float", "instanceof", "super", "synchronized", "throw"];

/**
 * calculate the random index within the arr length [0, len), return the value in that index.
 * @param input
 * @returns {*}
 */
let randomWord = function (arr) {
    return arr[Math.floor(Math.random() * Math.floor(arr.length))];
};

let isCorrectGuess = function (word, char) {
    return word.includes(char);
};

/**
 * returns ["_", "_", "_", "_", "_"] getBlanks("hello");
 * @param word
 * @returns array
 */
let getBlanks = function (word) {
    return word.split("").map(c => '_');
};

/**
 *  returns ["h", "", "", "", ""] fillBlanks("hello", ["", "", "", "", "_"], "h");
 *  returns ["", "e", "l", "l", ""] fillBlanks("hello", ["", "e", "", "", ""], "l");
 *
 * @param word
 * @param currentStateArr
 * @param filledLetter
 * @returns {*}
 */
let fillBlanks = function (word, currentStateArr, filledLetter) {
    let newStateArr = JSON.parse(JSON.stringify(currentStateArr));  //deep copy current state so we don't pollute it.

    if (currentStateArr.indexOf(filledLetter) >= 0) {   //already checked, just return the same as current state.
        return newStateArr;
    }

    for (let i = 0; i < word.length; i++) {
        if (word[i] === filledLetter) {
            newStateArr[i] = filledLetter;
        }
    }

    return newStateArr;
};

//Round object contains all the information for one game multiple rounds.
function Round(word, guessesLeft, wrongGuesses, puzzleState) {
    this.word = word;
    this.guessesLeft = guessesLeft;
    this.wrongGuesses = wrongGuesses;
    this.puzzleState = puzzleState;
}

// initial round
let setupRound = function (word) {
    return new Round(word, 9, [], getBlanks(word))
};

/**
 * When guess a correct char, we call fill blanks without touching guesses left field.
 * If the guess is wrong, we decrease the guess left and add a wrong guess.
 *
 * This method will update passed in 'round' object directly, no return value.
 *
 * @param round
 * @param guessed
 */
let updateRound = function (round, guessed) {
    if (isCorrectGuess(round.word, guessed)) {
        round.puzzleState = fillBlanks(round.word, round.puzzleState, guessed);
    } else {
        round.wrongGuesses.push(guessed);
        round.guessesLeft = round.guessesLeft - 1;
    }
};

//if the puzzle state cannot find '_', then win.
let hasWon = function(puzzleState) {
    return puzzleState.indexOf("_") < 0;
};

// lost if there is no guess left.
let hasLost = function(guessesLeft) {
    return guessesLeft <= 0;
};

let isEndOfRound = function(round) {
    return hasWon(round.puzzleState) || hasLost(round.guessesLeft);
};

/**
 * words - the array of words passed as an argument,
 * wins - the number of wins passed as an argument,
 * losses - the number of losses passed as an argument,
 * round - a new round object created with a random word from words.
 */
function Game(words, wins, losses, round) {
    this.words = words;
    this.wins = wins;
    this.losses = losses;
    this.round = round;
}

let setupGame = function(words, wins, losses) {
    return new Game(words, wins, losses, setupRound(randomWord(words)));
};

let startNewRound = function(game) {
    if (isEndOfRound(game.round)) {
        if (hasWon(game.round.puzzleState)) {
            game.wins = game.wins + 1;
            alert("You win! The word was '" + game.round.word + "'. ❤️")
        } else {
            game.losses = game.losses + 1;
            alert("You lost! The word was '" + game.round.word + "'. Try again! ❤️")
        }
        game.round = setupRound(randomWord(game.words));
    }
};

// a new game.
let myGame = setupGame(gameWords, 0, 0);

/**
 * update html divs display based on myGame obj.
 *
 * @param document
 * @param game
 */
let updateHtml = function(document, game) {
    document.getElementById("puzzle-state").innerHTML = game.round.puzzleState.join(" ");
    document.getElementById("wrong-guesses").innerHTML = game.round.wrongGuesses;
    document.getElementById("guesses-left").innerHTML = game.round.guessesLeft;
    document.getElementById("win-counter").innerHTML = game.wins;
    document.getElementById("loss-counter").innerHTML = game.losses;
};
