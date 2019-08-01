/**
 * AI for tic-tac-toe
 */
import {randIndex} from './game-functions.js'

function selectRandomEmptySquare(squares) {
  const emptySquareIndices = squares
                              .map((v,i) => v===null ? i : null)
                              .filter((v) => v!==null);
  const emptySquareIndex = randIndex(emptySquareIndices.length);
  return emptySquareIndices[emptySquareIndex];
}

// Start with random choice.
function wopr(squares, myCharacter, oponentCharacter) {
  return selectRandomEmptySquare(squares);
}

export {wopr};
