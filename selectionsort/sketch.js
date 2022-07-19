// import processing.sound.*;
// int fq = 1;
// SinOsc sinWave;

var arr;
var pos;
var smallPos;
var testPos;

var stepwise = true;


function setup() {
  createCanvas(400, 400);
  background(0);

  // sinWave = new SinOsc(this);
  // sinWave.play();

  arr = randomArray(100);
  pos = 0;
  smallPos = pos;
  testPos = smallPos + 1;

  if (stepwise) {
    noLoop();
  }
}

function draw() {
  background(0);

  if (pos == arr.length-1) {
    displayArray(arr, -1, -1, -1);
    //sinWave.stop();
  }
  //else
  else {
    displayArray(arr, pos, testPos, smallPos);
    // fq = arr[testPos];
    // sinWave.freq(fq);
    //compare elements at testPos and smallPos
    if (arr[testPos] < arr[smallPos]) {
    //if testPos element < smallPos element, update smallPos
      smallPos = testPos;
    }
    //move testPos over 1
    testPos++;

    //if testPos == length of the array
    if (testPos == arr.length) {
      //swap(pos, smallPos)
      swap(arr, pos, smallPos);
      //move pos over by 1
      pos++;
      //set testPos to pos + 1
      testPos = pos+1;
      //set smallPos to pos
      smallPos = pos;
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
