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

    if (checkWin !== null) {
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
     * A.I. move
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
      bestmove = minMaxMove(game.board, game.actualPlayer, 0, -Infinity, Infinity);
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
    player2: [checkSettings.player2Type, $('#input-5').val()],
    firstMove: checkSettings.firstMove
  };

	for (var option in checkSettings) {
    // Check if game options properly set.
    if (checkSettings.hasOwnProperty(option)) {
      if (!checkSettings[option]) {
        alert("Please set: " + option);
        return;
      }
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

$(function() {
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
