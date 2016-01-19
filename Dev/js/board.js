var BOARDSIZE = 3;

var Board = function(squares) {
 if (squares) {
   this.squares = squares.slice();
 } else {
   this.squares = generateArray(Math.pow(BOARDSIZE, 2), null);
 }
};

Board.prototype.move = function(square, player) {
  this.squares[square] = player;
};

Board.prototype.getEmptySquares = function() {
  var emptySquares = [];
  this.squares.forEach(function(square, index) {
    if (square === null) {
      emptySquares.push(index);
    }
  });
  return emptySquares;
};

Board.prototype.getSquare = function(index) {
  return this.squares[index];
};

Board.prototype.checkWin = function() {
  var winnerLine = {player: null, line: null};
  var lines = this.getWinnerLines();
  for (var index = 0, len = lines.length; index < len; index++) {
    var lineSet = new Set(lines[index]);
    if (lineSet.size === 1) { // Set.size = 1 ->> elements of line are the same.
      winnerLine.player = lineSet.values().next().value;
      if (winnerLine.player !== null) {
        winnerLine.line = index;
        break;
      }
    } else if (this.isFull()){
      winnerLine.player = TIE;
    }
  }
  return winnerLine;
};

Board.prototype.getWinnerLines = function() {
  var lines = [];
  lines.extend = function(array) {
    this.push.apply(this, array);
    return this;
  };
  lines.extend(this.getRows()).extend(this.getCols()).extend(this.getDiagonals());
  return lines;
};

Board.prototype.getRows = function() {
  var rows = [[],[],[]];
  this.squares.forEach(function(square, index) {
    rows[parseInt(index / BOARDSIZE)].push(square);
  });
  return rows;
};

Board.prototype.getCols = function() {
  var cols = [[],[],[]];
  this.squares.forEach(function(square, index) {
    cols[parseInt(index % BOARDSIZE)].push(square);
  });
  return cols;
};

Board.prototype.getDiagonals = function() {
  var squares = this.squares;
  var diagonals = [[],[]];
  for (var i = 0; i < BOARDSIZE; i++) {
    diagonals[0].push(squares[i * BOARDSIZE + i]);
    diagonals[1].push(squares[(i + 1) * (BOARDSIZE - 1)]);
  }
  return diagonals;
};

Board.prototype.isEmpty = function () {
  if (this.getEmptySquares().length == Math.pow(BOARDSIZE, 2)) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.isFull = function () {
  if (this.getEmptySquares().length === 0) {
    return true;
  } else {
    return false;
  }
};

function generateArray(length, element) {
  var arr = Array.apply(null, Array(length));
  return arr.map(function() {return element;});
}
