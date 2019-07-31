import {getPlayer, calculateWinner, indexToCoords} from './game-functions.js';
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
  expect(calculateWinner(squares, characteristicLength)).toBe(null);

  // Player One wins with a straight accross the top.
  squares.fill(playerOneChar, 0, characteristicLength);
  expect(calculateWinner(squares, characteristicLength)).toBe(playerOneChar);
});

// indexToCoords
test('Converts indices to coordinates', () => {
  const numSquares = characteristicLength * characteristicLength;
  expect(indexToCoords(0, characteristicLength)).toStrictEqual([0,0]);
  expect(indexToCoords(numSquares-1, characteristicLength)).toStrictEqual([characteristicLength-1,characteristicLength-1]);
});
