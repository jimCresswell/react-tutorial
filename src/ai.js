/**
 * AI for tic-tac-toe
 */
import {randIndex} from './game-functions.js'

function selectRandomEmptySquare(squares) {
  // If a square is empty (value==null) then grab its index otherwise return null.
  // Then throw away the "null" indices, leaving a list of indices of empty squares.
  const emptySquareIndices = squares
                              .map((v,i) => v===null ? i : null)
                              .filter((v) => v!==null);
  // Pick an empty square at random and return its
  // index in the squares array representing the board.
  return emptySquareIndices[randIndex(emptySquareIndices.length)];
}

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
