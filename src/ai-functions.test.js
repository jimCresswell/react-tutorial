import {
  filterByAvailability,
  getInitialSquareWeights,
  winningLineToWeights,
  lineWeightsToSquareWeights,
  getBestMoves
} from './ai-functions.js';

describe('AI logic functions', () => {

  test('Filters potential winning lines blocked by opponent character', () => {
    const opponentCharacter = 'x';
    const squares = [null, 'x', null, null];
    const potentialWinningLines = [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3],
      [0, 3],
      [1, 2],
    ];
    const expectedWinningLines = [
      [2, 3],
      [0, 2],
      [0, 3],
    ];
    expect(filterByAvailability(squares, potentialWinningLines, opponentCharacter)).toStrictEqual(expectedWinningLines);
  });

  test('Given a board size generate initial square weights', () => {
    const characteristicLength = 2;
    const initialSquareWeights = getInitialSquareWeights(characteristicLength);
    const expectedSquareWeights = [
      {squareIndex: 0, weight: 0},
      {squareIndex: 1, weight: 0},
      {squareIndex: 2, weight: 0},
      {squareIndex: 3, weight: 0}
    ];
    expect(initialSquareWeights).toStrictEqual(expectedSquareWeights);
  });

  test('Maps from winning line indices to weights depending on square availability', () => {
    const characteristicLength = 2;
    const winningLine = [0, 1];

    // All squares in line available.
    let squares = Array(characteristicLength*characteristicLength).fill(null);
    let weights = winningLineToWeights(squares, winningLine, characteristicLength);
    let expectedWeights = [{squareIndex: 0, weight: 1}, {squareIndex: 1, weight: 1}];
    expect(weights).toStrictEqual(expectedWeights);

    // One square in line not available.
    // Weights redistributed and total weight increased by one to indicate winning move possible.
    squares[1] = 'somePlayerCharacter';
    weights = winningLineToWeights(squares, winningLine, characteristicLength);
    expectedWeights = [{squareIndex: 0, weight: 3}, {squareIndex: 1, weight: 0}];
    expect(weights).toStrictEqual(expectedWeights);
  });

  test('Square weights are derived from winning line weights', () => {
    // 2x2 board = [null, 'x', null, null]
    // giving winning lines
    //       [2, 3],
    //       [0, 2],
    //       [0, 3],
    const initialSquareWeights = [
      {squareIndex: 0, weight: 0},
      {squareIndex: 1, weight: 0},
      {squareIndex: 2, weight: 0},
      {squareIndex: 3, weight: 0}
    ];
    const lineWeights = [
      [{squareIndex: 2, weight: 1}, {squareIndex: 3, weight: 1}],
      [{squareIndex: 0, weight: 1}, {squareIndex: 2, weight: 1}],
      [{squareIndex: 0, weight: 1}, {squareIndex: 3, weight: 1}],
    ];
    const expectedSquareWeights = [
      {squareIndex: 0, weight: 2},
      {squareIndex: 1, weight: 0},
      {squareIndex: 2, weight: 2},
      {squareIndex: 3, weight: 2}
    ];
    const squareWeights = lineWeightsToSquareWeights(lineWeights, initialSquareWeights);
    expect(squareWeights).toStrictEqual(expectedSquareWeights);
  });

  test('Gets the best moves', () => {
    // Made up weights, not realistic, but test the function well.
    const squareWeights = [
      {squareIndex: 0, weight: 2.5},
      {squareIndex: 1, weight: 0},
      {squareIndex: 2, weight: 2.5},
      {squareIndex: 3, weight: 2}
    ];
    const bestMoves = getBestMoves(squareWeights);
    const expectedBestMoves = [
      {squareIndex: 0, weight: 2.5},
      {squareIndex: 2, weight: 2.5},
    ];
    expect(bestMoves).toStrictEqual(expectedBestMoves);
  });

});
