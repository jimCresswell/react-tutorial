function getPlayer(xIsNext) {
  return xIsNext ? 'X' : 'O';
}

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
  const boardWidth = 3;
  const boardHeight = 3;

  const x = index % boardWidth;
  const y = Math.trunc(index/boardHeight);

  return [x,y];
}

export {getPlayer, calculateWinner, indexToCoords};
