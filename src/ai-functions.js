/**************
/** AI Support Functions
***************/

function getEmptySquareIndices(squares) {

  // TODO: Move to game-functions
  // If a square is empty (value==null) then grab its index otherwise return null.
  // Then throw away the "null" indices, leaving a list of indices of empty squares.
  return squares
          .map((v,i) => v===null ? i : null)
          .filter((v) => v!==null);
}

export {getEmptySquareIndices};
