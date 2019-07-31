import {playerOneChar, playerTwoChar} from './game-config.js';

function getPlayer(playerOneNext) {
  return playerOneNext ? playerOneChar : playerTwoChar;
}

function generateWinningLines(length) {
  const rows = Array(length)
                .fill(true)
                .map((v, i) => Array(length)
                                .fill(i*length)
                                .map((v, i) => v+i)
                );

  const columns = Array(length)
                    .fill(true)
                    .map((v, i) => Array(length)
                                    .fill(i)
                                    .map((v, i) => v + i*length)
                    );

const diagonals = Array(2)
                    .fill(true)
                    .map((v,i) => Array(length)
                                    .fill(i)
                                    .map((v, i) => i*(length+1-v) + v*(length-i-v))
                    );

  // All the potential winning lines.
  return [].concat(rows, columns, diagonals);
}

function calculateWinner(squares, length) {

  let result = {
    winner: null,
    winningLine: null
  };

  // Get all the potential winning lines.
  const lines = generateWinningLines(length);

  const winningLines = lines
    // For each potential winning line get the current played characters from the game.
    .map(indices => indices.map(index => ({index:index, value:squares[index]})))
    // Remove lines which are not full.
    .filter((line) => line.every((v) => v.value!==null))
    // Remove lines where not all the characters are the same.
    // Any lines remaining are winning lines.
    .filter((line) => line.every((v,i,a) => a[0].value===v.value));

  // If there are no winning lines return null.
  if (winningLines.length < 1) return result;

  // If there is at least one winning line then there should only be one.
  const winningLine = winningLines[0];
  // The winning character is the same across the line.
  const winner = winningLine[0].value;
  // Grab the winning squares index values
  const winningLineIndices = winningLines[0].map((lines) => lines.index);

  result.winner = winner;
  result.winningLine = winningLineIndices;

  return result;
}

/**
 * Takes a linear index for a game square and returns the x,y coordinates
 * of the square, 0 indexed, counting left to right, top to bottom.
 * @param  {Number} index linear index of the square
 * @param  {Number} characteristicLength the board height, width and win line length
 * @return {Array}       x,y coordinates of the square
 */
function indexToCoords(index, characteristicLength) {
  const x = index % characteristicLength;
  const y = Math.trunc(index/characteristicLength);

  return [x,y];
}

/**
 * Create an array n items long and fill it with the result of invoking function f.
 * For use with jsx markup descriptions.
 * @param  {Number} n length of array
 * @param  {Function} f function to generate array content.
 * @return {Array}   array of length n filled with results of calling f.
 */
function repeat(n, f) {
 return Array(n).fill(true).map(() => f());
}

export {getPlayer, generateWinningLines, calculateWinner, indexToCoords, repeat};
