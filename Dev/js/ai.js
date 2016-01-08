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
 * Monte Carlo simulation for A.I. to decide its next move
 *    This is not a perfect player since it's just generate a bunch of games
 *    with random moves and score the board if game is end, then pick the the
 *    move with the highest score. Could be used for set different
 *    difficulty level for the game.
 */

function mcTrial(board, player) {
  /** This function takes a current board and the next player to move.
   *    Play a game starting with the given player by making random moves,
   *    alternating between players.
   */
   var currentPlayer = switchPlayer(player);
   while (board.getEmptySquares().length !== 0 && board.checkWin() == null) {
    square = Math.randomChoice(board.getEmptySquares());
    currentPlayer = switchPlayer(currentPlayer);
    board.move(square[0], square[1], currentPlayer);
   }
}

function mcUpdaeScores(scores, board, player) {
  /**
   * This function scores the completed board and update the scores grid.
   */
  var scoreCurrent = 1;
  var scoreOther = 1;
  var dim = board.dim;
  function scoring(player) {
    // This is a helper function to loop through the board and score it.
    if (board.squares[row][col] === player) {
      scores[row][col] += scoreCurrent;
    } else if (board.squares[row][col] === switchPlayer(player)) {
      scores[row][col] -= scoreOther;
    }
  }
  //console.log("board: ",board);
  if (board.checkWin() !== null) {
    if (board.checkWin() === player) {
      for (var row = 0; row < dim; row++) {
        for (var col = 0; col < dim; col++) {
          scoring(player);
        }
      }
    } else {
      for (var row = 0; row < dim; row++) {
        for (var col = 0; col < dim; col++) {
          scoring(switchPlayer(player));
        }
      }
    }
  }
}

function getBestmove(board, scores, player) {
  /**
   * Find all of the empty squares with the maximum
   *    score and randomly return one of them
   */
   var moves = board.getEmptySquares();
   var goodOnes = [];
   var scorelist = [];
   var highScore = 0;
   var numberOfMoves = 0;

   moves.forEach(function(move) {
     scorelist.push(scores[move[0]][move[1]]);
   });

   highScore = Math.max(...scorelist);

   if (moves.length == 6 && board.squares[1][1] == player) {
     moves.forEach(function(move) {
       if ((move[0] + move[1]).mod(2) == 1) {
         goodOnes.push(move);
       }
     });
   } else {
     moves.forEach(function(move) {
         if (scores[move[0]][move[1]] === highScore) {
           goodOnes.push([move[0],move[1]]);
         }
     });
   }
   return Math.randomChoice(goodOnes);
}

function mcMove(board, player) {
  /**
  * This function uses the Monte Carlo simulation to return
  *    a move for the machine player.
  */
  var scores = allItemMatrix(0, board.dim, board.dim);
  var currentBoard = new Board(board.dim, board.squares);

  if (board.getEmptySquares !== []) {
    for (var trial = 0; trial < 1500; trial++) {
      mcTrial(currentBoard, player);
      mcUpdaeScores(scores, currentBoard, player);
      currentBoard = new Board(board.dim, board.squares);
    }
  }
  return getBestmove(currentBoard, scores, player);
}
