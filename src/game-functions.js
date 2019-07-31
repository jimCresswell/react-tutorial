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
  // Get all the potential winning lines.
  const lines = generateWinningLines(length);

  const winner = lines
    // For each potential winning line get the current played characters from the game.
    .map(indices => indices.map(index => squares[index]))
    // Remove lines which are not full.
    .filter((line) => line.every((v) => v!==null))
    // Remove lines where not all the characters are the same.
    .filter((line) => line.every((v,i,a) => a[0]===v))
    // Any lines remaining are winning lines.
    // Map to first instance of winning character and extract.
    // Reduce to single character or null.
    .map((lines) => lines[0])[0] || null;

  // Will be a player character or null.
  return winner;
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
