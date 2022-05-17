/* ===================
  This program will generate a "space invaders"
  -like progression of circles in the screen.

  The first circle will be in the upper left
  corner, entirely visible (no part of the
  circle should be off screen).

  The row of circles will move across to the
  right. When the right-most circle reaches the
  end of the screen, the whole row will move
  down by the diameter of the circles.

  After moving down, the circles will move to
  the right, until the first circle reaches the
  left end of the screen, and the row moves down.

  When the row of circles would move past the
  bottom of the screen, they instead should
  appear at the top again.

  At all times, all circles should be visible.
   =================== */

/* ===================
  Global variables needed:
  x, y, radius, numCircles, speed.
  (integers)
   =================== */
int x;
int y;
int radius;
int numCircles;
int speed;

/* ===================
  setup:
  1. Call size() and background()
  2. Set the program to run 1 frame a second.
  3. Set the radius to a reasonable value.
  4. Set x and y to locate the center of the
     first circle.
  5. Set speed such that the row of circles
     will move 1 full circle at a time.
  6. Set numCircles to 2
  7. Once your entire program works with 2 circles,
     test other values.
   =================== */
void setup() {
  size(500, 400);
  background(255);
  frameRate(1);

  radius = 25;
  x = radius;
  y = radius;
  numCircles = 2;
  speed = radius * 2;
}

/* ===================
   draw:
   1. Set the background
   2. Call drawRow (see below)
   3. Update x and y, and apply whatever
      code is needed to generate the desired
      movement.
   =================== */
void draw() {
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

/* ===================
   drawRow:
   Draw a number of circles in a horizontal
   row given the center of the first (left-most)
   circle, radius of each circle, and the
   number of circles.
   =================== */
void drawRow(int x, int y, int radius, int n) {
  fill(255, 0, 255);
  while ( n != 0 ) {
    circle(x, y, radius * 2);
    x+= radius * 2;
    n--;
  }
}
