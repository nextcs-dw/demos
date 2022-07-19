import processing.sound.*;
int fq = 1;
SinOsc sinWave;


int arr[];
int pos;
int sortEnd;
int insertVal;
boolean shifting;

boolean stepwise = true;

void setup() {

  sinWave = new SinOsc(this);
  //sinWave.play();

  size(400, 400);
  background(0);
  arr = randomArray(10);
  //frameRate(1);

  //start:
  //consider index 0 sorted
  //index 1 is the value to insert
  //keep track fo value at index 1
  sortEnd = 0;
  pos = 1;
  insertVal = arr[pos];
  shifting = true;

  if (stepwise) {
    noLoop();
  }
}//setup

void draw() {
  background(0);

  //if we've reached the end, don't continue
  if (sortEnd == arr.length-1) {
    displayArray(arr, -1, -1, -1);
    sinWave.stop();
  }//done sorting
  else {
    displayArray(arr, pos, sortEnd, insertVal);
    fq = arr[pos];
    sinWave.freq(fq);
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

}//draw


void swap(int[] arr, int i0, int i1) {
  int t = arr[i0];
  arr[i0] = arr[i1];
  arr[i1] = t;
}//swap

int[] randomArray(int num) {
  int[] values = new int[num];

  for (int i=0; i<values.length; i++) {
    values[i] = int(random(100, 400));
  }//random value loop
  return values;
}//randomArray

void displayArray(int[] arr, int p, int se, int iv) {
  int barWidth = width / arr.length;
  int x = 0;
  int y = 0;
  noStroke();
  for (int i=0; i<arr.length; i++) {
    y = height - arr[i];
    if (i == se ) {
      fill(230, 0, 230);
    }
    else if (i == p) {
      fill(0, 230, 230);
    }
    else {
      fill(255);
    }
    rect(x, y, barWidth, arr[i]);
    if (i == p) {
      fill(230, 230, 0);
      rect(x, height-iv, barWidth, iv);
    }
    x+= barWidth;
  }
}//displayArray


void keyPressed() {
  if (stepwise) {
    redraw();
  }
}
