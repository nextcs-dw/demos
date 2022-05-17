/* ===================
 The goal of this program is to create a game with a
 single player controlled ball and many other balls.

 The non-player balls should move around using the same
 movement code we've been using.

 The player ball will follow the mouse.

 When the player ball collides with another ball, that
 ball will stop moving and begin to grow in size.

 Once a growing ball has reached a specific maximum size,
 it will begin to shrink (not moving).

 Once a shrinking ball has reached a specific minimum size,
 it will stop shrinking, and should no longer move, grow
 or shrink.
 ===================*/

/* ===================
 These "constants" are the maximum and minimum sizes
 for the non-player balls.
 ===================*/
int MAX_SIZE = 100;
int MIN_SIZE = 10;


/* ===================
 These are the state options for the non-player balls.
 The values are not important, they just need to
 be different from each other.
 A ball will only ever be in 1 of these states at a time.
 ===================*/
int MOVING = 0;
int GROWING = 1;
int SHRINKING = 2;
int STOPPED = 3;
int DEAD = 4;

/* ===================
 Global variables
 balls: array of non-player balls.
 player: the player-controlled ball.
 ===================*/
Ball balls[];
Ball player;

/* ===================
 setup
 1. Call size (done)
 2. Call frameRate (done)
 4. Create the player ball (done)
 5. Initialize balls.
 6. Use the default constructor to create a ball
 in each array spot.

 ===================*/
void setup() {
  size(600, 600);
  frameRate(60);

  player = new Ball(mouseX, mouseY, 0, 0, 20, 255);
  balls = new Ball[10];
  for (int i=0; i<balls.length; i++) {
    balls[i] = new Ball();
  }
}


/* ===================
 draw
 1. Set background (done)
 2. For each non-player ball
   Display the ball
   If the ball is not in the STOPPED state
     If the ball is colliding with the player,
     call collideState().
     If the ball is not colliding, use changeState() to
     set the ball to MOVING.
     Call act()
 3. Display the player ball (done)
 4. Set the player ball to be located where the
    mouse is (done).
 ===================*/
void draw() {
  background(0);

  for (int i=0; i<balls.length; i++) {
    balls[i].display();
    if (balls[i].state != STOPPED) {
      if (player.detect(balls[i])) {
        balls[i].collideState();
      } else {
        balls[i].changeState(MOVING);
      }
    }
    balls[i].act();
  }

  player.display();
  player.cx = mouseX;
  player.cy = mouseY;
}

/* ===================
 updateState
 Go through the array of balls and use the
 changeState method using the parameter value.
 ===================*/
void updateState(int state) {
  for (int i=0; i<balls.length; i++) {
    balls[i].changeState(state);
  }
}

/* ===================
 keyPressed
 When s is pressed, use updateState() to
 set all the non-player balls to STOPPED.
 When m is pressed, use updateState to
 set all the non-player balls to MOVING.
 ===================*/
void keyPressed() {
  if (key == 's') {
    updateState(STOPPED);
  }
  else if (key == 'm') {
    updateState(MOVING);
  }
