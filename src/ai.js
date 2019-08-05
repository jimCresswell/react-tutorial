/**
 * AI for tic-tac-toe
 */
import {randIndex} from './game-functions.js'


/**************
/** Support Functions
***************/

function getEmptySquareIndices(squares) {
  // If a square is empty (value==null) then grab its index otherwise return null.
  // Then throw away the "null" indices, leaving a list of indices of empty squares.
  return squares
          .map((v,i) => v===null ? i : null)
          .filter((v) => v!==null);
}


/**************
/** Random Choice
***************/

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
 *    add the value of that square in each winning line. Normalise
 *    the weights to the total number of squares on the board. This is now a
 *    probabilitic map of moves that progress to a winning state. Note that
 *    takes no account of how close the opponent is to winning.
 * 5. Choose a square index randomly/probabilistically from the highest weighted squares.
 *
 * Extension
 * E1. Repeat the algorithm for the opponent character.
 * E2. If the highest opponent probability of winning is greater than your
 *      probability of winning then choose to block rather than move towards winning.
 */

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
function wopr(squares, myCharacter, oponentCharacter) {
  // Start with random choice.
  return selectRandomEmptySquare(squares);
}

export {wopr};
