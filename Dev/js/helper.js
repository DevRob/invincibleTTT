/**
* This is the collection of general helper functions not related to the game itself.
*/
Number.prototype.mod = function(number) {
  /**
   * Add modulus prototype to Number type since "%" is a remainder
   *    operator and it does not work with negative numbers.
   */
 return ((this % number) + number) % number;
};

Array.prototype.extend = function(array) {
  // Extend an Array with another one.
  this.push.apply(this, array);
};

Array.prototype.last = function(){
  // Return the last element of the array
  return this[this.length - 1];
};

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
