/**
 * AI interfaces for tic-tac-toe
 */
import {randIndex, generateWinningLines} from './game-functions.js';
import {getEmptySquareIndices} from './ai-functions.js';



/**************
/** Random Choice
***************/

// 'Easy' option that picks a random empty square.
function selectRandomEmptySquare(squares) {
  const emptySquareIndices = getEmptySquareIndices(squares);
  // Pick an empty square at random and return its
  // index in the squares array representing the board.
  return emptySquareIndices[randIndex(emptySquareIndices.length)];
}


/**************
/** Better AI
***************/

/**
 * Algorithm to choose square most likely to constribute to a win
 *
 * 1. Generate a list of all potential winning lines.
 * 2. Eliminate those lines blocked by having at least one opponent
 *    character in them.
 * 3. For each remaining potential winning line:
 *  3.1. Give each square a value (weight) of 1.
 *  3.2. For each square occupied by your own character redistribute those
 *      values to the emtpy squares. This upweights squares in partially
 *      filled lines, favouring squares choices closer to winning states.
 * 4. For each square on the board give it a default weight of 0 then
 *    add the value of that square in each winning line. This is now a
 *    probabilitic map (if it were normalised) of moves that progress to a
 *    winning state. Note this takes no account of how close the opponent is to winning.
 * 5. Choose a square index randomly from the highest weighted squares.
 *
 * Extension
 * E1. Repeat the algorithm for the opponent character.
 * E2. If the highest opponent probability of winning is greater than your
 *      probability of winning then choose to block rather than move towards winning.
 */

function selectBestEmptySquare(squares, myCharacter, oponentCharacter) {

  console.log(squares);
  console.log('DEBUG', 'computer' + myCharacter, 'human' + oponentCharacter);

  // 1
  const characteristicLength = Math.sqrt(squares.length);

  const winningLines = generateWinningLines(characteristicLength);
  console.log(winningLines);

  // 2
  const remainingWinningLines = winningLines.filter((line) => {
    const playedLine = line.map((index) => squares[index]);
    return !playedLine.some((playedCaracter) => playedCaracter===oponentCharacter);
  });
  console.log(remainingWinningLines);

  // 3.1 and 3.2
  const winningLineWeights = remainingWinningLines
                      .map((line) => {
                        const numEmptySquares = line.filter(squareIndex => squares[squareIndex]===null).length;
                        return line.map(squareIndex => {
                          const isEmpty = squares[squareIndex]===null;
                          return {
                            squareIndex: squareIndex,
                            weight: isEmpty ? characteristicLength / numEmptySquares : 0
                          }
                        });
                      });
  console.log('winningLineWeights', winningLineWeights);

  // 4 For each square on the board sum the weights from the winning lines,
  // retaining square indices so we can sort and still know which board square we're talking about.
  const initialSquareWeights = Array.from(squares).fill().map((v,i) => ({squareIndex: i, weight: 0}));

  const squareWeights = winningLineWeights
                  .flat()
                  .reduce((accumulatingSquareWeights, square) => {
                    accumulatingSquareWeights[square.squareIndex].weight += square.weight;
                    return accumulatingSquareWeights;
                  }, initialSquareWeights);

  console.log('squareWeights', squareWeights);

  // 5. Select from the best moves.
  // Sort weights in place.
  squareWeights.sort((a, b) => a.weight < b.weight)
  // Get highest weight;
  const highestWeight = squareWeights[0].weight;
  // Get the best move options.
  const bestMoves = squareWeights.filter(square => square.weight === highestWeight);

  console.log('bestMoves', bestMoves);
  // Return a random selection from the possible best moves.
  return bestMoves[randIndex(bestMoves.length)].squareIndex;
}

/**************
/** Export
***************/

/**
 * Pick a square on the board for the computer go and
 * return its index in the squares array.
 * @param  {Array} squares          The array representing the game baord.
 * @param  {String} myCharacter      Player Two (computer) character.
 * @param  {String} oponentCharacter Player One (human) character.
 * @return {Number}                  The index in `squares` representing the computer move choice.
 */
function wopr(squares, myCharacter, oponentCharacter) {
  return selectBestEmptySquare(squares, myCharacter, oponentCharacter);
}

export {wopr};
