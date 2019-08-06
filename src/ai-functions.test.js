import {getEmptySquareIndices} from './ai-functions.js';

describe('AI logic functions', () => {

  test('Returns only the empty indicies', () => {
    const input = ['hello', null, 1, null, false, null, 0];
    const expectedIndices = [1, 3, 5];

    expect(getEmptySquareIndices(input)).toStrictEqual(expectedIndices);
  });
});
