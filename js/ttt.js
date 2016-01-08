$(function() {
  /**
  * Collection of general helper functions not related to the game itself.
  */
  Number.prototype.mod = function(number) {
    /**
     * Add modulus prototype to Number type since "%" is a remainder
     *    operator and it does not work with negative numbers.
     */
   return ((this % number) + number) % number;
  }

  Array.prototype.extend = function(array) {
    // Extend an Array with another one.
    this.push.apply(this, array);
  }

  Array.prototype.last = function(){
    // Return the last element of the array
    return this[this.length - 1];
  }

  Math.randomChoice = function (array) {
    // Pick a random item from an array.
    return array[parseInt(Math.floor(Math.random() * array.length))];
  };

  function allItemMatrix(item, numRows, numCols) {
    /**
     * Generate an array of arrays with these dimensions
     *    (number of rows * number of columns) and fill up
     *    the matrix with the same element(item).
     */
     var matrix = [];
     for (var row = 0; row < numRows; row++) {
       matrix.push([]);
       for (var col = 0; col < numCols; col++) {
         matrix[row].push(item);
       }
     }
     return matrix;
  }

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
        return Math.randomChoice(["bob", "tom", "selly", "katy", "zorg"])
      }
      return name
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
  }

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
  }

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
       }
       return calc[parseInt(winLineIdx / dim)]
     }
   };

   Game.prototype.getCoord = function(idx) {
     /**
      * Given a grid position in the form (row or col), returns
      *    the coordinates on the canvas of the center of the grid.
      */
     return this.squareSize * (idx + 0.5);
   }

   Game.prototype.getSquare = function(x, y) {
     /**
      * Given coordinates on a canvas, gets the indices of the grid.
      */
      return {row: parseInt(y / this.squareSize),
              col: parseInt(x / this.squareSize)};
   }

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

   /**
   * A.I. functions for the computer player
   */

   /**
   * Mini-max algorithm to power the perfect A.I. player. Using depth first search
   *    to find the possible moves for winning, losing or tie the game then
   *    score the moves accordingly.
   */

   function score(board, player, depth) {
     /**
     * This is the scoring function wich called on the bottom of the tree.
     */
     var checkWin = board.checkWin();
     var score = Math.pow(board.dim, 2) + 1
     if (checkWin) {
       if (checkWin == 3) {
         return {score: 0};
       } else if (checkWin == 1) {
         return {score: (depth - score)};
       } else {
         return {score: (score - depth)};
       }
     } else {
       return;
     }
   }

   function minMaxMove(board, player, depth) {
     /**
     * Mini-max algorithm to generate possible moves and pick the best move.
     */
     depth += 1

     var moves = [];
     var empties = board.getEmptySquares();

     if (board.checkWin()) {
       return score(board, player, depth);
     } else {
       for (var i = 0, len = empties.length; i < len; i++) {
         var cloneBoard = new Board(board.dim, board.squares);
         cloneBoard.move(empties[i], player);
         moves.push({
           score: minMaxMove(cloneBoard, switchPlayer(player), depth).score,
           move: empties[i]
         });
       }
       moves.sort(function(a, b) {
         return a.score - b.score;
       });

       if (player == 0) {
         return moves[0];
       } else if (player == 1) {
         return moves.last();
       }
     }
   }

   /**
   * Main app dealing with game loop, menu items and manipulating DOM elements.
   */
   var canvas = document.getElementById('canvas');
   var menu = document.getElementById('menu');
   var ingameUI = document.getElementById('ingameUI');
   var ctx = canvas.getContext('2d');
   var canvasSize = window.innerHeight * 0.6;

   ctx.mozImageSmoothingEnabled = true;
   ctx.msImageSmoothingEnabled = true;
   ctx.imageSmoothingEnabled = true;

   canvas.width = canvas.height = canvasSize;

   function newGame() {
     /**
      * Restars the game by reloading window.
      */
     location.reload();
   }

   function startGame() {
     /**
      * Initialise game and kick off the game loop.
      */
     var game;
     var winnerCounter = [0, 0, 0];
     var settings = loadSettings();

     if (settings) {
       // condition to start the game.
       game = new Game(settings);
       menu.style.display = "none";
       ingameUI.style.display = "block";
       $('.player1').text(game.players[0].playerName);
       $('.player2').text(game.players[1].playerName);
       gameLoop();
     }

     function gameLoop(mouseEvent) {
       /**
        * "Emulating" game loop, while giving back control to the browser after
        *    every move since a simple while loop execution wold block the rendering.
        */
       var checkWin = game.board.checkWin();

       refreshCounter(winnerCounter, checkWin);
       game.drawMove();

       if (checkWin != null) {
         game.drawMove();
         if (checkWin != 3) {
           game.drawWin();
         }
         setTimeout(function() {
           // Reset the game when game ends.
           game.resetGame();
           gameLoop();
         }, 1250);
       } else {
         if (game.players[game.actualPlayer].playerType == "A.I.") {
           setTimeout(function() {
             // Call A.I. move function if needed.
             aiMove();
           }, 750);
         } else if (game.players[game.actualPlayer].playerType == "Human") {
           // Add click event listener to canvas on human player move.
           canvas.addEventListener('mousedown', humanMove);
         }
       }
     }

     function humanMove(mouseEvent) {
       /**
        * Human player move. Given that the square is empty place a move on it.
        *    Switch player, remove the mouse event listener than call the gameloop again.
        */
       var squareSize = game.squareSize;
       var squareClicked = game.getSquare(mouseEvent.offsetX, mouseEvent.offsetY);

       if (game.board.squares[squareClicked.row][squareClicked.col] === null) {
         game.board.move([squareClicked.row, squareClicked.col], game.actualPlayer);
         game.actualPlayer = switchPlayer(game.actualPlayer);
         canvas.removeEventListener('mousedown', humanMove);
         gameLoop();
       }
     }

     function aiMove() {
       /**
        * A.I. move // TODO: alpha/beta pruning,
        */
       var bestmove = {};

       if (game.board.getEmptySquares().length >= Math.pow(game.board.dim, 2)) {
         /**
          * Pick a random move for initial move if board is empty since the
          *    mini-max algorithm is slow on an empty board and does not pick
          *    any better move.
          */
         bestmove = {score: 10, move: Math.randomChoice(game.board.getEmptySquares())};
       } else {
         bestmove = minMaxMove(game.board, game.actualPlayer, 0);
       }

       game.board.move(bestmove.move, game.actualPlayer);
       game.actualPlayer = switchPlayer(game.actualPlayer);
       gameLoop();
     }
   }

   function loadSettings() {
     /**
      *  Returns the game settings from DOM elements in menu.
      */
     var checkSettings = {
       boardSize : 3,
       player1Type: $('#radio1').children('.checked').attr('data-ptype1'),
       player2Type: $('#radio2').children('.checked').attr('data-ptype2'),
       firstMove : $('#radio3').children('.checked').attr('data-firstmove')
     };

     var settings = {
       boardSize: checkSettings.boardSize,
       player1: [checkSettings.player1Type, $('#input-4').val()],
       player2: [checkSettings.player1Type, $('#input-5').val()],
       firstMove: checkSettings.firstMove
     };

     for (option in checkSettings) {
       // Check if game options properly set.
       if (!checkSettings[option]) {
         alert("Please set: " + option);
         return;
       }
     }
     return settings;
   }

   function refreshCounter(counter, gamestate) {
     /**
      *  Refresh the winner counter.
      */
     counter[gamestate - 1] += 1;
     $('#0').children('span').text(counter[0]);
     $('#1').children('span').text(counter[1]);
     $('#2').children('span').text(counter[2]);
   }

   /**
   * Manage fake radio buttons in menu.
   */
   $('.fake-button').on('click', function() {
     $(this).parent('.button-bar').find('img').addClass("gray-filter");
     $(this).siblings('.fake-button').removeClass("checked");
     $(this).children('img').removeClass("gray-filter");
     $(this).addClass("checked");

   });

   $('#startGame').on('click', startGame);
   $('#newgame').on('click', newGame);

});
