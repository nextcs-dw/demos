import processing.sound.*;
int fq = 1;
SinOsc sinWave;

int arr[];
int pos; //current position to look at
int testPos; //second position to test
int endPos; //last position to check - end of the unsorted portion


boolean stepwise = false;

void setup() {
  size(400, 400);
  background(0);

  sinWave = new SinOsc(this);
  sinWave.play();

  arr = randomArray(100);
  pos = 0;
  testPos = pos + 1;
  endPos = arr.length - 1;

  if (stepwise) {
    noLoop();
  }
}//setup


void draw() {
  background(0);

  //if the end isn't 0, keep sorting
  if (endPos != 0) {

    //display
    displayArray(arr, pos, testPos, endPos);
    fq = arr[testPos];
    sinWave.freq(fq);

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
    sinWave.stop();
  }
  //saveFrame("data/"+nf(frameCount, 3)+".png");

}

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

void displayArray(int[] arr, int p, int tp, int sp) {
  int barWidth = width / arr.length;
  int x = 0;
  int y = 0;
  noStroke();
  for (int i=0; i<arr.length; i++) {
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


void keyPressed() {
  if (stepwise) {
    redraw();
  }
}
