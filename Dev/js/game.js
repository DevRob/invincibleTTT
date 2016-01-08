/**
 * Game and Player constructor.
 */
var Player = function(player) {
  /**
   * Storing player info.
   */
  this.playerName = pickName(player[1]);
  this.playerType = player[0];

  function pickName(name) {
    // Return a rndom name from the list if player name not specified.
    if (!name) {
      return Math.randomChoice(["bob", "tom", "selly", "katy", "zorg"]);
    }
    return name;
  }
};

var Game = function(settings) {
  /**
   * This contains game settings and tracking the game state,
   *    plus drawing board and moves on canvas.
   */

  this.boardSize = settings.boardSize;
  this.board = new Board(this.boardSize);
  this.squareSize = canvas.width / this.boardSize;
  this.players = [new Player(settings.player1), new Player(settings.player2)];
  this.winner = null;
  this.frameSetup();
  this.firstMove = settings.firstMove;
  this.actualPlayer = this.setFirstPlayer(this.firstMove);
};

Game.prototype.setFirstPlayer = function() {
  /**
   * Set first player.
   */
  if (this.firstMove > 1) {
    return  Math.randomChoice([0, 1]);
  } else {
    return parseInt(this.firstMove);
  }
};

Game.prototype.frameSetup = function() {
  /**
   * Draw the grid on canvas.
   */
  for (var i = 1, len = this.boardSize; i < len; i++) {
    lineStart = [this.squareSize * i, 0];
    lineEnd = [this.squareSize * i, canvas.height];
    for (var j = 0; j < 2; j++) {
      ctx.beginPath();
      ctx.moveTo(lineStart[0], lineStart[1]);
      ctx.lineTo(lineEnd[0], lineEnd[1]);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#8894a0';
      ctx.stroke();
      lineStart.reverse();
      lineEnd.reverse();
    }
  }
};

Game.prototype.drawMove = function () {
  /**
   * Draws the player's move on the board.
   */
  var squares = this.board.squares;
  var squareSize = this.squareSize;

  for (var row = 0, rowLen = squares.length; row < rowLen; row++) {
    for (var col = 0, colLen = squares[row].length; col < colLen; col++) {
        if (squares[row][col] === 0) {
          ctx.beginPath();
          ctx.arc(this.getCoord(col), this.getCoord(row), canvas.width / (2 * this.boardSize) * 0.5, 0, 2 * Math.PI);
          ctx.strokeStyle = '#626e7a';
          ctx.lineWidth = this.squareSize / 10;
          ctx.stroke();
        } else if (squares[row][col] === 1) {
          ctx.beginPath();
          ctx.moveTo(this.getCoord(col) + squareSize / 4, this.getCoord(row) + squareSize / 4);
          ctx.lineTo(this.getCoord(col) - squareSize / 4, this.getCoord(row) - squareSize / 4);
          ctx.moveTo(this.getCoord(col) + squareSize / 4, this.getCoord(row) - squareSize / 4);
          ctx.lineTo(this.getCoord(col) - squareSize / 4, this.getCoord(row) + squareSize / 4);
          ctx.strokeStyle = '#27a8e0';
          ctx.lineCap="round";
          ctx.lineWidth = this.squareSize / 10;
          ctx.stroke();
        }
      }
    }
 };

 Game.prototype.drawWin = function() {
   /**
    * Draw winner cross-out line if there is a winner.
    */
   var squares = this.board.squares;
   var squareSize = this.squareSize;
   var lines = this.board.lines;
   var dim = parseInt(this.board.dim);
   var winLineIdx = parseInt(this.board.winnerLine);
   var endpoints = getEndPoints(winLineIdx);
   var player = this.actualPlayer;

   ctx.beginPath();
   /**
    * Offset the endpoint of the cross-out with 12 pixel so it's
    *    not perfectly alligned with the lines of the X sign.
    */
   ctx.moveTo(this.getCoord(endpoints[0][1]), this.getCoord(endpoints[0][0]) + 12);
   ctx.lineTo(this.getCoord(endpoints[1][1]), this.getCoord(endpoints[1][0]) - 12);
   ctx.strokeStyle = '#8894a0';
   ctx.lineCap="round";
   ctx.lineWidth = this.squareSize / 7;
   ctx.stroke();

   function getEndPoints(winLineIdx) {
     // Get the coordinates of the winner-line's endpoints.
     var calc = {
       0: [[winLineIdx, 0],[winLineIdx, dim-1]],
       1: [[0, winLineIdx.mod(dim)],[dim-1, winLineIdx.mod(dim)]],
       2: [[(winLineIdx-2*dim)*(dim-1), 0],[((winLineIdx-2*dim+1).mod(2))*(dim-1), dim-1]]
     };
     return calc[parseInt(winLineIdx / dim)];
   }
 };

 Game.prototype.getCoord = function(idx) {
   /**
    * Given a grid position in the form (row or col), returns
    *    the coordinates on the canvas of the center of the grid.
    */
   return this.squareSize * (idx + 0.5);
 };

 Game.prototype.getSquare = function(x, y) {
   /**
    * Given coordinates on a canvas, gets the indices of the grid.
    */
    return {row: parseInt(y / this.squareSize),
            col: parseInt(x / this.squareSize)};
 };

 Game.prototype.resetGame = function() {
   /**
    * Reset game.
    */
   this.board.init();
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   this.setFirstPlayer();
   this.frameSetup();
   this.winner = null;

 };

 function switchPlayer(actualPlayer) {
   /**
    * Convenience function to switch players. Returns other player.
    */
   return parseInt((actualPlayer + 1) % 2);
 }
