/**
* Mini-max algorithm to power the perfect A.I. player. Using depth first search
*    to find the possible moves for winning, losing or tie the game then
*    score the moves accordingly.
*/

function score(checkWin, depth) {
  var score = 10;
  var scoreTable = {
    0: {score: (depth - score)},
    1: {score: (score - depth)},
    2: {score: 0}
  };
  return scoreTable[checkWin];
}

function minMaxMove(board, player, depth) {
  depth += 1;
  var moves = [], cloneBoard = {};
  var empties = board.getEmptySquares();
  var checkWin = board.checkWin().result;

  if (checkWin !== null) {
    return score(checkWin, depth);
  } else {
    for (var i = 0, len = empties.length; i < len; i++) {
      cloneBoard = new Board(board.squares);
      cloneBoard.move(empties[i], player);
      moves.push({
        score: minMaxMove(cloneBoard, nextPlayer(player), depth).score,
        move: empties[i]
      });
    }
    return getBestMove(moves, player);
  }
}

function getBestMove(moves, player) {
  moves.sort(function(a, b) {return a.score - b.score;});
  if (player === PLAYERO) {
    return moves[0];
  } else if (player == PLAYERX) {
    return moves[moves.length - 1];
  }
}

function nextPlayer(player) {
  return (player + 1) % 2;
}
