var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
var player = 0;
function drawsymbol(position) {
  /**
  *
  */
  context.beginPath()
  context.arc(position.offsetX, position.offsetY, 30, 0, 2 * Math.PI);
  context.lineWidth = 10;
  if (player === 0) {
    context.strokeStyle = 'red';
    player = 1;
  } else {
    context.strokeStyle = 'blue';
    player = 0;
  }
  context.stroke();

}
canvas.addEventListener('mousedown', drawsymbol);
