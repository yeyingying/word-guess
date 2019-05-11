var gameWords = ["let", "this", "long", "package", "float", "instanceof", "super", "synchronized", "throw"];

var randomWord = function (arr) {
    return arr[Math.floor(Math.random() * Math.floor(arr.length))];
};

var isCorrectGuess = function (word, char) {
    return word.includes(char);
};

var getBlanks = function (word) {
    var result = [];
    for (var i = 0; i < word.length; i++) {
        result.push("_");
    }
    return result;
};

var fillBlanks = function (word, currentStateArr, filledLetter) {
    var newStateArr = JSON.parse(JSON.stringify(currentStateArr));  //deep copy current state so we don't pollute it.

    if (currentStateArr.indexOf(filledLetter) >= 0) {   //already checked, just return the same as current state.
        return newStateArr;
    }

    for (var i = 0; i < word.length; i++) {
        if (word[i] === filledLetter) {
            newStateArr[i] = filledLetter;
        }
    }

    return newStateArr;
};

function Round(word, guessesLeft, wrongGuesses, puzzleState) {
    this.word = word;
    this.guessesLeft = guessesLeft;
    this.wrongGuesses = wrongGuesses;
    this.puzzleState = puzzleState;
}

var setupRound = function (word) {
    return new Round(word, 9, [], getBlanks(word))
};

var updateRound = function (round, guessed) {
    if (isCorrectGuess(round.word, guessed)) {
        round.puzzleState = fillBlanks(round.word, round.puzzleState, guessed);
    } else {
        round.wrongGuesses.push(guessed);
        round.guessesLeft = round.guessesLeft - 1;
    }
};

var hasWon = function(puzzleState) {
    return puzzleState.indexOf("_") < 0;
};

var hasLost = function(guessesLeft) {
    return guessesLeft <= 0;
};

var isEndOfRound = function(round) {
    return hasWon(round.puzzleState) || hasLost(round.guessesLeft);
};

function Game(words, wins, losses, round) {
    this.words = words;
    this.wins = wins;
    this.losses = losses;
    this.round = round;
}

var setupGame = function(words, wins, losses) {
    return new Game(words, wins, losses, setupRound(randomWord(words)));
};

var startNewRound = function(game) {
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

var myGame = setupGame(gameWords, 0, 0);

var updateHtml = function(document, game) {
    document.getElementById("puzzle-state").innerHTML = game.round.puzzleState.join(" ");
    document.getElementById("wrong-guesses").innerHTML = game.round.wrongGuesses;
    document.getElementById("guesses-left").innerHTML = game.round.guessesLeft;
    document.getElementById("win-counter").innerHTML = game.wins;
    document.getElementById("loss-counter").innerHTML = game.losses;
};
