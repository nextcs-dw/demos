let y;
let radius;
let numCircles;
let speed;


function setup() {
  createCanvas(500, 400);
  background(255);
  frameRate(1);

  radius = 25;
  x = radius;
  y = radius;
  numCircles = 5;
  speed = radius * 2;
}

function draw() {
  background(255);
  drawRow(x, y, radius, numCircles);
  x+= speed;

  if (x < radius) {
    x = radius;
    speed *= -1;
    y+= radius * 2;
  }
  if (x + (2*numCircles - 1)*radius > width) {
    x-= speed;
    speed *= -1;
    y+= radius * 2;
  }
  if (y + radius > height) {
    y = radius;
  }

}

function drawRow(x, y, radius, n) {
  fill(255, 0, 255);
  while ( n != 0 ) {
    circle(x, y, radius * 2);
    x+= radius * 2;
    n--;
  }
}
