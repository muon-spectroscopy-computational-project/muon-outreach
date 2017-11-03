var GPU = require('gpu.js');

const gpu = new GPU();
const multiplyMatrix = gpu.createKernel(function(a, b) {
  var sum = 0;
  for (var i = 0; i < 512; i++) {
    sum += a[this.thread.y][i] * b[i][this.thread.x];
  }
  return sum;
}).setOutput([512, 512]);

const c = multiplyMatrix(a, b);