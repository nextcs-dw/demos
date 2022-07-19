// import processing.sound.*;
// int fq = 1;
// SinOsc sinWave;

var arr;
var pos;
var sortEnd;
var insertVal;
var shifting;

var stepwise = true;


function setup() {
  createCanvas(400, 400);
  background(0);

  // sinWave = new SinOsc(this);
  // sinWave.play();

  arr = randomArray(100);
  sortEnd = 0;
  pos = 1;
  insertVal = arr[pos];
  shifting = true;
  if (stepwise) {
    noLoop();
  }
}

function draw() {
  background(0);

  if (sortEnd == arr.length-1) {
    displayArray(arr, -1, -1, -1);
    //sinWave.stop();
  }//done sorting
  else {
    displayArray(arr, pos, sortEnd, insertVal);
    // fq = arr[pos];
    // sinWave.freq(fq);
    if (pos != 0 && arr[pos-1] > insertVal) {
      arr[pos] = arr[pos-1];
      pos--;
    }
    else {
      arr[pos] = insertVal;
      sortEnd++;
      pos = sortEnd + 1;
      if (pos < arr.length) {
      insertVal = arr[pos];
      }
    }
  }
}


function swap(arr, i0, i1) {
  var t = arr[i0];
  arr[i0] = arr[i1];
  arr[i1] = t;
}//swap

function randomArray( num) {
  values = new Array(num)

  for (var i=0; i<values.length; i++) {
    values[i] = int(random(100, 400));
  }//random value loop
  return values;
}//randomArray

function displayArray(arr, p, tp, sp) {
  var barWidth = width / arr.length;
  var x = 0;
  var y = 0;
  noStroke();
  for (var i=0; i<arr.length; i++) {
    y = height - arr[i];
    if (i == p ) {
      fill(230, 0, 230);
    }
    else if (i == tp) {
      fill(0, 230, 230);
    }
    else if (i == sp) {
      fill(230, 230, 0);
    }
    else {
      fill(255);
    }
    rect(x, y, barWidth, arr[i]);
    x+= barWidth;
  }
}//displayArray


function keyPressed() {
  if (key == 's' && stepwise) {
    stepwise = false;
    loop();
  }
  else if (key == 's' && !stepwise) {
    stepwise = true;
    noLoop();
  }
  else if (stepwise) {
    redraw();
  }
}
