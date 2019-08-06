/**************
/** AI Support Functions
***************/

// Return potential winning lines which aren't blocked by an opponent character.
function filterByAvailability(squares, winningLines, oponentCharacter) {
  return winningLines.filter((line) => {
    const playedLine = line.map((index) => squares[index]);
    return !playedLine.some((playedCaracter) => playedCaracter===oponentCharacter);
  });
}

function getInitialSquareWeights(characteristicLength) {
  return Array(characteristicLength*characteristicLength)
          .fill()
          .map((v,i) => ({squareIndex: i, weight: 0}));
}

// Map from winning line indices to to objects containing the square index and the weighting for that square in the current line.
// Give each square in a potential winning line a weight of 1, then redistribute the weight between the empty squares in the line.
// We don't care if non-empty character are ours or oponents because we already filtered out potential winning lines blocked by the opponent.
function winningLineToWeights(squares, line, characteristicLength) {
  const numEmptySquares = line.filter(squareIndex => squares[squareIndex]===null).length;
  let totalLineWeight = characteristicLength;

  // If the next move on this line wins the game upweight the line.
  if (numEmptySquares === 1) totalLineWeight += 1;

  return line.map(squareIndex => {
    const isEmpty = squares[squareIndex]===null;
    return {
      squareIndex: squareIndex,
      weight: isEmpty ? totalLineWeight / numEmptySquares : 0
    };
  })
}

// Iterate over the line weights and sum weights on the board.
function lineWeightsToSquareWeights(lineWeights, initialSquareWeights) {
  return (lineWeights
    .reduce((flatArray, line) => flatArray.concat(line), [])
    .reduce((accumulatingSquareWeights, square) => {
      accumulatingSquareWeights[square.squareIndex].weight += square.weight;
      return accumulatingSquareWeights;
    }, initialSquareWeights));
}

// Given a board full of weights, get the best moves.
function getBestMoves(squareWeights) {
  // Sort weights in place.
  squareWeights.sort((a, b) => a.weight < b.weight)
  // Get highest weight;
  const highestWeight = squareWeights[0].weight;
  // Get the best move options.
  return squareWeights.filter(square => square.weight === highestWeight);
}

export {
  filterByAvailability,
  getInitialSquareWeights,
  winningLineToWeights,
  lineWeightsToSquareWeights,
  getBestMoves
};
