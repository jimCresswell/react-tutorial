import {getPlayer, calculateWinner, indexToCoords} from './pure-functions.js';
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
  expect(calculateWinner(squares)).toBe(null);

  // Player One wins with a straight accross the top.
  squares.fill(playerOneChar, 0, characteristicLength);
  expect(calculateWinner(squares)).toBe(playerOneChar);
});

// indexToCoords
test('Converts indices to coordinates', () => {
  expect(indexToCoords(0)).toStrictEqual([0,0]);
  expect(indexToCoords(7)).toStrictEqual([1,2]);
});
