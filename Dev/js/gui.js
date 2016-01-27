var BLUE = '#27a8e0';
var GREY = '#8894a0';
var DARKGREY = '#626e7a';

var GUI = function(game) {
  this.game = game;
  this.canvas = document.getElementById('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.menu = document.getElementById('menu');
  this.scoreScreen = document.getElementById('scoreScreen');
  this.winnerCount = [0, 0, 0];
};

GUI.prototype.updateBoard = function () {
  var self = this;
  self.clearCanvas().refreshCounter().drawBoard();
  self.game.board.squares.forEach(function(square, index) {
    if (square == PLAYERO) {
      self.drawNought(index);
    } else if (square == PLAYERX) {
      self.drawCross(index);
    }
  });
  self.drawWin();
};

GUI.prototype.drawBoard = function() {
  var canvasSize = window.innerHeight * 0.6;
  this.canvas.width = this.canvas.height = canvasSize;
  this.squareSize = canvasSize / 3;
  var start, end;
  for (var i = 1; i < BOARDSIZE; i++) {
    start = [this.squareSize * i, 0];
    end = [this.squareSize * i, canvasSize];
    for (var j = 0; j < BOARDSIZE - 1; j++) {
      this.line(start, end, 0, GREY, 5);
      start.reverse();
      end.reverse();
    }
  }
};

GUI.prototype.drawNought = function(index) {
  var radius = this.squareSize / 4;
  var position = this.getCoord(index);
  this.circle(position, radius, DARKGREY, this.squareSize / 10);
};

GUI.prototype.drawCross = function(index) {
  var size = this.squareSize / 3;
  var position = this.getCoord(index);
  var start = [position.y - size, position.x];
  var end = [position.y + size, position.x];
  this.line(start, end, 45, BLUE, this.squareSize / 10);
  this.line(start, end, 135, BLUE, this.squareSize / 10);
};

GUI.prototype.drawWin = function() {
  var line;
  var gameState = this.game.board.checkWin();
  if (gameState.result == PLAYERO || gameState.result == PLAYERX) {
    line = this.buildLine(this.winLineProp(gameState.line));
    this.line(line.start, line.end, line.angle, GREY, this.squareSize / 7);
  }
};

GUI.prototype.buildLine = function(line) {
  var midPoint = this.getCoord(line.midpoint);
  var start = [midPoint.y - this.squareSize * line.scale, midPoint.x];
  var end = [midPoint.y + this.squareSize * line.scale, midPoint.x];
  return {start: start, end: end, angle: line.angle};
};

GUI.prototype.winLineProp = function (index) {
  var properties = {
    0: {midpoint: 1, scale: 1.1, angle: 2},
    1: {midpoint: 4, scale: 1.1, angle: -2},
    2: {midpoint: 7, scale: 1.1, angle: 1},
    3: {midpoint: 3, scale: 1.1, angle: 91},
    4: {midpoint: 4, scale: 1.1, angle: 89},
    5: {midpoint: 5, scale: 1.1, angle: 88},
    6: {midpoint: 4, scale: 1.5, angle: 47},
    7: {midpoint: 4, scale: 1.5, angle: 132}
  };
  return properties[index];
};

GUI.prototype.line = function(start, end, angle, color, width) {
  /** can rotate a horizontal line by angle set @param {number} - angle */
  var len = Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2));
  var deltaY = len / 2 * Math.sin(angle * Math.PI / 180);
  var deltaX = deltaY / Math.tan((360 - angle / 2 - 90) * Math.PI / 180);
  var ctx = this.ctx;
	ctx.beginPath();
  ctx.moveTo(start[0] + deltaX, start[1] - deltaY);
  ctx.lineTo(end[0] - deltaX, end[1] + deltaY);
  ctx.strokeStyle = color;
  ctx.lineCap="round";
  ctx.lineWidth = width;
  ctx.stroke();
};

GUI.prototype.circle = function(position, radius, color, width) {
  var ctx = this.ctx;
  ctx.beginPath();
  ctx.arc(position.y, position.x, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
};

GUI.prototype.getCoord = function(squareIndex) {
 return {
   x: this.squareSize * (parseInt(squareIndex / 3) + 0.5),
   y: this.squareSize * ((squareIndex % 3) + 0.5)
 };
};

GUI.prototype.getSquareIndex = function(coord) {
  var row = parseInt(coord.offsetY / this.squareSize);
  var col = parseInt(coord.offsetX / this.squareSize);
  return row * 3 + col;
};

GUI.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  return this;
};

GUI.prototype.hideMenu = function() {
  this.menu.style.display = "none";
  return this;
};

GUI.prototype.showScoreScreen = function() {
  this.scoreScreen.style.display = "block";
  return this;
};

GUI.prototype.refreshCounter = function() {
  var counter = this.winnerCount;
  counter[this.game.board.checkWin().result] += 1;
  $('#0').children('span').text(counter[0]);
  $('#1').children('span').text(counter[1]);
  $('#2').children('span').text(counter[2]);
  return this;
};

GUI.prototype.drawPlayerName = function() {
  $('.player1').text(game.players[0].playerName);
  $('.player2').text(game.players[1].playerName);
  return
};

GUI.prototype.smoothening = function () {
  var ctx = this.ctx;
  ctx.mozImageSmoothingEnabled = true;
  ctx.msImageSmoothingEnabled = true;
  ctx.imageSmoothingEnabled = true;
  return this;
};
