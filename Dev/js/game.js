var PLAYERO = 0;
var PLAYERX = 1;
var TIE = 2;
var NAMES = ["bob", "tom", "selly", "katy", "zorg", "daro", "rik", "nisi"];

var Player = function(player) {
  /** @param {Object} player - name and type. */
  this.playerName = pickName(player.name);
  this.playerType = player.type;
  function pickName(name) {
    if (!name) {
      return randomChoice(NAMES);
    }
    return name;
  }
};

var Game = function(settings) {
  /** @param {Object} settings - game settings from DOM elements. */
  this.board = new Board();
  this.currentPlayer = this.setFirstPlayer(settings.firstMove);
  this.players = {
    0: new Player(settings.player1),
    1: new Player(settings.player2)
  };
};

Game.prototype.setFirstPlayer = function(firstMove) {
  if (firstMove > 1) {
    return randomChoice([PLAYERO, PLAYERX]);
  } else {
    return parseInt(firstMove);
  }
};

Game.prototype.switchPlayer = function() {
 this.currentPlayer = nextPlayer(this.currentPlayer);
};

Game.prototype.inProgress = function() {
  var winner = this.board.checkWin().player;
  if (winner === null) {
    return true;
  } else {
    return false;
  }
};

 Game.prototype.resetGame = function() {
   this.board = new Board();
   this.switchPlayer();
 };

 Game.prototype.getPlayerType = function() {
   return this.players[this.currentPlayer].playerType;
 };

 function randomChoice(array) {
   return array[parseInt(Math.floor(Math.random() * array.length))];
 }
