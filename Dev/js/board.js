/**
 * Board constructor to represent the gameboard as an array of arrays. Can be used
 *    for other games, size adjustable.
 */

var Board = function(dim, squares) {
 /**
  * Create Board class.
  */
 this.dim = dim;
 if (!squares) {
   this.init();
 } else {
   this.squares = getSquares(squares);
 }
};

Board.prototype.init = function () {
  /**
   * Initialise board.
   */
  this.squares = allItemMatrix(null, this.dim, this.dim);
};

Board.prototype.getEmptySquares = function() {
  /**
   * Get the [row, col] index pair of empty squares.
   */
  var squares = this.squares,
      emptySquares = [];

  for (var row = 0, numRows = squares.length; row < numRows; row++) {
    for (var col = 0, numCol = squares[row].length; col < numCol; col++) {
      if (squares[row][col] === null) {
        emptySquares.push([row, col]);
      }
    }
  }
  return emptySquares
}

Board.prototype.move = function(pos, player) {
  /**
   * Place player's piece on board.
   */
  var row = pos[0],
      col = pos[1];

  if (this.squares[row][col] === null) {
    this.squares[row][col] = player;
  }
}

Board.prototype.checkWin = function() {
  /**
   * Check winning conditions.
   */
  self = this;
  self.lines = [];
  self.winnerLine = null;
  self.gameStatus = null;
  /**
  * Get rows by make a copy of the board since the board is
  *    represented as an array of rows of the board.
  */
  self.lines.extend(self.squares);
  /**
  * Get columns iterating through the rows and picking the
  *    corresponding element for the column.
  */
  var cols = [];
  for (var i = 0, len = self.dim; i < len; i++) {
    cols.push([]);
    self.squares.forEach(function(row) {
      cols[i].push(row[i]);
    });
  }
  self.lines.extend(cols);
  /**
  * Get diagonal lines
  */
  var diag1 = [],
      diag2 = [];
  for (var row = 0, numRows = self.squares.length; row < numRows; row++) {
    diag1.push(self.squares[row][row]);
    diag2.push(self.squares[row][Math.abs(row - self.squares[row].length) - 1]);
  }

  self.lines.push(diag1);
  self.lines.push(diag2);
  /**
  * Iterate through the possible winning combinations and check
  *    if they match winning conditions.
  */
  for (var i = 0, lines = self.lines, len = self.lines.length; i < len; i++) {
    var lineSet = new Set(lines[i]);
    if (lineSet.size === 1) { // Set.size = 1 ->> elements of line are the same.
      if (!lineSet.has(null)) {
        self.winnerLine = self.lines.indexOf(lines[i]);
        if (lines[i][0] === 0) {
          self.gameStatus = 1;
          break;
        } else {
          self.gameStatus = 2;
          break;
        }
      }
    } else if (self.getEmptySquares().length == 0) {
      self.gameStatus = 3;
    }
  }
  return self.gameStatus;
}

Board.prototype.logBoard = function() {
  /**
  * log the board on the console for debugging purposes if needed.
  *    I had a great use of it.
  */
  var squares = this.squares;
  var cells = [];
  console.log("-------------------");
  squares.forEach(function(row) {
    row.forEach(function(cell) {
      if (cell == 0) {
        cells.push("O");
      } else if (cell == 1) {
        cells.push("X");
      } else {
        cells.push("-");
      }
    });
    console.log(cells);
    cells = [];
  });
  console.log("-------------------");
}

function getSquares(squares) {
  /*
  * Helper function to clone the board.
  */
  var squaresClone = [];
  squares.forEach(function(row) {
    squaresClone.push([]);
    row.forEach(function(cell) {
      squaresClone[squares.indexOf(row)].push(cell);
    });
  });
  return squaresClone;
}
