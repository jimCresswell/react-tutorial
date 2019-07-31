import {getPlayer, generateWinningLines, calculateWinner, indexToCoords} from './game-functions.js';
import {characteristicLength, playerOneChar, playerTwoChar} from './game-config.js';

// getPlayer
test('Gets next player symbol', () => {
  let playerOneNext = true;
  expect(getPlayer(playerOneNext)).toBe(playerOneChar);

  playerOneNext = false;
  expect(getPlayer(playerOneNext)).toBe(playerTwoChar);
});

// calculateWinner.
test('Identifies winning moves', () => {
  // No moves
  let squares = Array(characteristicLength * characteristicLength).fill(null);
  let result = calculateWinner(squares, characteristicLength);
  expect(result.winner).toBe(null);
  expect(result.winningLine).toBe(null);

  // Player One wins with a straight accross the top.
  squares.fill(playerOneChar, 0, characteristicLength);
  result = calculateWinner(squares, characteristicLength);
  // The expected winning line is the top row [1,2,3,4...]
  let expectedWinningLine = Array(characteristicLength).fill(true).map((v,i) => i);

  expect(result.winner).toBe(playerOneChar);
  expect(result.winningLine).toStrictEqual(expectedWinningLine);
});

// indexToCoords
test('Converts indices to coordinates', () => {
  const numSquares = characteristicLength * characteristicLength;
  expect(indexToCoords(0, characteristicLength)).toStrictEqual([0,0]);
  expect(indexToCoords(numSquares-1, characteristicLength)).toStrictEqual([characteristicLength-1,characteristicLength-1]);
});

test('Generates winning lines', () => {
  // 2*2 board
  let potentialWinningLines = generateWinningLines(2);
  let expectedWinningLines = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
  ];
  expect(potentialWinningLines).toStrictEqual(expectedWinningLines);

  // 3*3 board
  potentialWinningLines = generateWinningLines(3);
  expectedWinningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  expect(potentialWinningLines).toStrictEqual(expectedWinningLines);
});
