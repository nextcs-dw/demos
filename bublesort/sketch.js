// import processing.sound.*;
// int fq = 1;
// SinOsc sinWave;

var arr;
var pos; //current position to look at
var testPos; //second position to test
var endPos; //last position to check - end of the unsorted portion
var stepwise = true;

function setup() {
  createCanvas(400, 400);
  background(0);

  // sinWave = new SinOsc(this);
  // sinWave.play();

  arr = randomArray(100);
  pos = 0;
  testPos = pos + 1;
  endPos = arr.length - 1;

  if (stepwise) {
    noLoop();
  }
}

function draw() {
  background(0);

    //if the end isn't 0, keep sorting
    if (endPos != 0) {

      //display
      displayArray(arr, pos, testPos, endPos);
      // fq = arr[testPos];
      // sinWave.freq(fq);

      //if second value is less than first, swap
      if (arr[testPos] < arr[pos]) {
        swap(arr, testPos, pos);
      }//smaller position

      //otherwise, move each position up
      else if (pos < endPos) {
        testPos++;
        pos++;
      }

      //if pos is at the end, reset pos to beginning, move end down 1
      if (pos >= endPos) {
        pos=0;
        testPos = pos+1;
        endPos--;
      }
    }
    //fully sorted! display
    else {
      displayArray(arr, -1, -1, -1);
      // sinWave.stop();
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
