import {getPlayer, calculateWinner, indexToCoords} from './pure-functions.js';

// getPlayer
test('Gets next player symbol', () => {
  let xIsNext = true;
  expect(getPlayer(xIsNext)).toBe('X');

  xIsNext = false;
  expect(getPlayer(xIsNext)).toBe('O');
});

// calculateWinner
test('Identifies winning moves', () => {
  // No moves
  let squares = Array(9).fill(null);
  expect(calculateWinner(squares)).toBe(null);

  // X wins
  squares = [null, 'O', 'X', null, 'X', 'O', 'X', '0', null];
  expect(calculateWinner(squares)).toBe('X');
});

// indexToCoords
test('Converts indices to coordinates', () => {
  expect(indexToCoords(0)).toStrictEqual([0,0]);
  expect(indexToCoords(7)).toStrictEqual([1,2]);
});
