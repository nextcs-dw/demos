int faceSize;
int hr;
int min;
int sec;

void setup() {
  size(400, 400);
  faceSize = 300;
  hr = hour();
  min = minute();
  sec = second();
  frameRate(1);
}

void draw() {
  background(255);

  clockFace();
  drawHand(sec, 60, 1, .45, color(255, 0, 0));
  drawHand(min, 60, 2, .40, color(0));
  drawHand(hr, 12, 4, .25, color(0));
  updateTime();

}


float timeToAngle(int t, int factor) { 
  float step = 360 / factor;
  float theta = t % factor * step;
  return radians(theta-90);
}


void drawHand(int time, int timeFactor, int lineWeight, float lineFactor, color lineColor) {
  float theta = timeToAngle(time, timeFactor);
  float handx = faceSize * lineFactor;
  float handy = faceSize * lineFactor;

  handx = handx * cos(theta) + width/2;
  handy = handy * sin(theta) + height/2;

  strokeWeight(lineWeight);
  stroke(lineColor);
  line(width/2, height/2, handx, handy);
}

void updateTime() {
  sec+= 1;
  if (sec == 60) {
    sec = 0;
    min+= 1;
  }
  if (min == 60) {
    min = 0;
    hr+= 1;
  }
  if (hr == 24) {
    hr = 0;
  }
}

void clockFace() {
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(width/2, height/2, faceSize);

  for (int i=0; i < 360; i+= 6) {
    float cx = width/2;
    float cy = height/2;
    float x =  cx + faceSize * 0.5 * cos(radians(i));
    float y =  cy + faceSize * 0.5 * sin(radians(i));
    
    float scale = 0.45;
    if (i % 90 == 0) {
      scale = 0.3;
    }
    else if (i % 30 == 0) {
      scale = 0.35;
    }
    cx = cx + faceSize * scale * cos(radians(i));
    cy = cy + faceSize * scale * sin(radians(i));
    line(cx, cy, x, y);
  }
}
