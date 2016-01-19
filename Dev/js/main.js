var game;
var gui;

function newGame() {
  location.reload();
}

function startGame() {
  var settings = loadSettings();
  if (settings) {
    game = new Game(settings);
    gui = new GUI(game);
    gui.hideMenu().showScoreScreen().smoothening().drawBoard();
    gameLoop();
  }
}

function gameLoop(mouseEvent) {
  var playerType = game.getPlayerType();
  if (game.inProgress()) {
    if (playerType == "A.I.") {
      setTimeout(function() {aiMove();}, 750);
    } else {
      letClick();
    }
  } else {
    setTimeout(function() {
      game.resetGame();
      gameLoop();
    }, 1250);
  }
  gui.updateBoard();
}

function humanMove(mouseEvent) {
  var squareClicked = gui.getSquareIndex(mouseEvent);
  var checkSquare = game.board.getSquare(squareClicked);
  if (checkSquare === null) {
    game.board.move(squareClicked, game.currentPlayer);
    game.switchPlayer();
    denyClick();
    gameLoop();
  }
}

function aiMove() {
  var bestmove = {};
  if (game.board.isEmpty()) {
    bestmove = {
      score: 10,
      move: randomChoice(game.board.getEmptySquares())
    };
  } else {
    bestmove = minMaxMove(game.board, game.currentPlayer, 0);
  }
  game.board.move(bestmove.move, game.currentPlayer);
  game.switchPlayer();
  gameLoop();
}

function letClick() {
  gui.canvas.addEventListener('mousedown', humanMove);
}

function denyClick() {
  gui.canvas.removeEventListener('mousedown', humanMove);
}


function loadSettings() {
  var checkSettings = {
    player1Type: $('#radio1').children('.checked').attr('data-ptype1'),
    player2Type: $('#radio2').children('.checked').attr('data-ptype2'),
    firstMove : $('#radio3').children('.checked').attr('data-firstmove')
  };
  var player1Name = $('#input-4').val();
  var player2Name = $('#input-5').val();
	for (var option in checkSettings) {
    if (checkSettings.hasOwnProperty(option)) {
      if (!checkSettings[option]) {
        alert("Please set: " + option);
        return;
      }
    }
  }
  return {
    player1: {type: checkSettings.player1Type, name: player1Name},
    player2: {type: checkSettings.player2Type, name: player2Name},
    firstMove: checkSettings.firstMove
  }
}

$(function() {
  // DOM manipulation
  $('.fake-button').on('click', function() {
    $(this).parent('.button-bar').find('img').addClass("gray-filter");
    $(this).siblings('.fake-button').removeClass("checked");
    $(this).children('img').removeClass("gray-filter");
    $(this).addClass("checked");
  });

  $('#startGame').on('click', startGame);
  $('#newgame').on('click', newGame);
});
