/**
 * AI interfaces for tic-tac-toe
 */
import {getEmptySquareIndices, randIndex, generateWinningLines} from './game-functions.js';
import {
  getInitialSquareWeights,
  filterByAvailability,
  winningLineToWeights,
  lineWeightsToSquareWeights,
  getBestMoves
} from './ai-functions.js';



/**************
/** Random Choice
***************/

// 'Easy' option that picks a random empty square.
function selectRandomEmptySquare(squares) {
  const emptySquareIndices = getEmptySquareIndices(squares);
  // Pick an empty square at random and return its
  // index in the squares array representing the board.
  return emptySquareIndices[randIndex(emptySquareIndices.length)];
}


/**************
/** Better AI
***************/

/**
 * Algorithm to choose square most likely to constribute to a win
 *
 * 1. Generate a list of all potential winning lines.
 * 2. Eliminate those lines blocked by having at least one opponent
 *    character in them.
 * 3. For each remaining potential winning line:
 *  3.1. Give each square a value (weight) of 1.
 *  3.2. For each square occupied by your own character redistribute those
 *      values to the emtpy squares. This upweights squares in partially
 *      filled lines, favouring squares choices closer to winning states.
 * 4. For each square on the board give it a default weight of 0 then
 *    add the value of that square in each winning line. This is now a
 *    probabilitic map (if it were normalised) of moves that progress to a
 *    winning state. Note this takes no account of how close the opponent is to winning.
 * 5. Choose a square index randomly from the highest weighted squares.
 *
 * Extension
 * E1. Repeat the algorithm for the opponent character.
 * E2. If the highest opponent probability of winning is greater than your
 *      probability of winning then choose to block rather than move towards winning.
 */

// Steps 1..5
function selectBestSquareToWin(squares, opponentCharacter) {
  // Set the initial square weights to zero.
  const characteristicLength = Math.sqrt(squares.length);
  const initialSquareWeights = getInitialSquareWeights(characteristicLength);

  // 1.
  const winningLines = generateWinningLines(characteristicLength);

  // 2.
  const remainingWinningLines = filterByAvailability(squares, winningLines, opponentCharacter);
  // If there are no more winning moves return a random empty square.
  if (remainingWinningLines.length === 0) {
    return ({
      squareIndex: selectRandomEmptySquare(squares),
      weight: 0
    });
  }

  // 3.
  const winningLineWeights = remainingWinningLines.map((line) => {
    return winningLineToWeights(squares, line, characteristicLength);
  });

  // 4 For each square on the board sum the weights from the winning lines.
  const squareWeights = lineWeightsToSquareWeights(winningLineWeights, initialSquareWeights);

  // 5.
  const bestMoves = getBestMoves(squareWeights);

  // Return a random selection from the possible best moves.
  return bestMoves[randIndex(bestMoves.length)];
}

// Steps E1..E2
function getBestSquare(squares, myCharacter, opponentCharacter) {
  const myBestSquare = selectBestSquareToWin(squares, opponentCharacter);
  const opponentBestSquare = selectBestSquareToWin(squares, myCharacter);

  // If we have the best move take it, otherwise block the opponents best move.
  if (myBestSquare.weight >= opponentBestSquare.weight) {
    return myBestSquare.squareIndex;
  }
  return opponentBestSquare.squareIndex;
}

// Just attack, don't care about defending.
function getBestAttack(squares, opponentCharacter) {
  return selectBestSquareToWin(squares, opponentCharacter).squareIndex;
}

/**************
/** Export
***************/

/**
 * Pick a square on the board for the computer go and
 * return its index in the squares array.
 * @param  {Array} squares          The array representing the game baord.
 * @param  {String} myCharacter      Player Two (computer) character.
 * @param  {String} oponentCharacter Player One (human) character.
 * @return {Number}                  The index in `squares` representing the computer move choice.
 */
function wopr(difficulty, squares, myCharacter, opponentCharacter) {
  let squareIndex;
  if (difficulty === "easy") {
    squareIndex = selectRandomEmptySquare(squares);
  } else if (difficulty === "medium") {
    squareIndex = getBestAttack(squares, opponentCharacter);
  } else {
    squareIndex = getBestSquare(squares, myCharacter, opponentCharacter);
  }
  return squareIndex;
}

export {wopr};
