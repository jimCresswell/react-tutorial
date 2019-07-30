import {boardWidth, boardHeight, playerOneChar, playerTwoChar} from './game-config.js';

function getPlayer(playerOneNext) {
  return playerOneNext ? playerOneChar : playerTwoChar;
}

// Assumes 3x3 board and 3 in row to win.
// TODO: In general a row in each row, a column in each column and two diagonals for a square board.
// TODO: This is what breaks if the board isn't square.
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Takes a linear index for a game square and returns the x,y coordinates
 * of the square, 0 indexed, counting left to right, top to bottom.
 * @param  {Number} index linear index of the square
 * @return {Array}       x,y coordinates of the square
 */
function indexToCoords(index) {
  const x = index % boardWidth;
  const y = Math.trunc(index/boardHeight);

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

export {getPlayer, calculateWinner, indexToCoords, repeat};
