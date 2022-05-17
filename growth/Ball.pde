/* ===================
  This Ball class starts with what we have developed
  in class. 
  
  A state instance variable has been added, the following 
  are the general rules for the states.
  
  MOVING: Ball moves according to the move() method.
  GROWING: Ball increases in radius.
  SHRINKING: Ball decreases in radius.
  STOPPED: Ball does not move or change size (but can change state).
  DEAD: Ball does not move, change size, or change state.
  
  The changeState, collideState and act methods must
  be completed.
 =================== */

class Ball {
  int cx;
  int cy;
  int xVel;
  int yVel;
  int radius;
  color c;
  int state;

  Ball() {
    c = color(int(random(255)), int(random(255)), int(random(255)));
    radius = int(random(10, 26));
    cx = int(random(radius, width-radius));
    cy = int(random(radius, height-radius));
    xVel= int(random(-5, 5));
    if (xVel == 0) { 
      xVel = 5;
    }
    yVel = int(random(-5, 5));
    if (yVel == 0) { 
      yVel = 5;
    }
    state = MOVING;
  } //constructor

  Ball(int x, int y, int xv, int yv, int r, color f) {
    cx = x;
    cy = y;
    xVel = xv;
    yVel = yv;
    radius = r;
    c = f;
    state = MOVING;
  }


  void move() {
    if (cx <= radius || cx >= (width-radius)) {
      xVel *= -1;
    }
    if ( cy <= radius ||
      cy > (height-radius)) {
      yVel *= -1;
    }
    cx+= xVel;
    cy+= yVel;
  }

  boolean detect(Ball other) {
    float d = dist(this.cx, this.cy, other.cx, other.cy);
    d = d - (this.radius + other.radius);
    return d <= 0;
  }

  void display() { 
    fill(c);
    circle(this.cx, this.cy, this.radius*2);
  }

/* ===================
  changeState
  If the calling ball is not in the DEAD state,
  set state the to parameter.
 ===================*/
  void changeState (int newState) {
    if (state != DEAD) {
      state = newState;
    }
  }
  
/* ===================
 collideState
 Changes the state of the calling ball as follows.
 1. DEAD balls should always stay DEAD
 2. SHRINKING balls should either stay SHRINKING or become
    DEAD if their radius has gone below MIN_SIZE
 3. Otherwise, balls should be GROWING until they reach
    MAX_SIZE, at which point they become SHRINKING.
 Remember, this mehtod is only called when a ball has
 collided with the player ball, so collided balls should
 not be MOVING.
 ===================*/
  void collideState() {
    if (state != DEAD) {
      if (state != SHRINKING ) {
        if (radius <= MAX_SIZE ) {
          state = GROWING;
        } else {
          state = SHRINKING;
        }
      } else {
        if (radius >= MIN_SIZE) {
          state = SHRINKING;
        } else {
          state = DEAD;
        }
      }
    }
  }

/* ===================
 act
 Perform an action based on the calling ball's state.
 MOVING: call move()
 GROWING: Increse radius by 1
 SHRINKING: Decrease radius by 1
 ===================*/
  void act() {
    if (state == MOVING) {
      move();
    } else if (state == GROWING) {
      radius++;
    } else if (state == SHRINKING) {
      radius--;
    }
  }
}
