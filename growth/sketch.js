var MAX_SIZE = 100;
var MIN_SIZE = 10;
var MOVING = 0;
var GROWING = 1;
var SHRINKING = 2;
var STOPPED = 3;
var DEAD = 4;

var balls;
var player;

function setup() {
  createCanvas(600, 600);
  frameRate(60);

  player = new Ball(false, mouseX, mouseY, 0, 0, 20, 255);
  balls = new Array(10);
  for (var i=0; i<balls.length; i++) {
    balls[i] = new Ball(true);
  }
}

function draw() {
  background(0);

  for (var i=0; i<balls.length; i++) {
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

function updateState(state) {
  for (var i=0; i<balls.length; i++) {
    balls[i].changeState(state);
  }
}

function keyPressed() {
  if (key == 's') {
    updateState(STOPPED);
  }
  else if (key == 'm') {
    updateState(MOVING);
  }
}




class Ball {

  constructor(randBall, x, y, xv, yv, r, f) {
    if (randBall) {
      this.c = color(random(256), random(256), random(256));
      this.radius = int(random(10, 26));
      this.cx = int(random(this.radius, width-this.radius));
      this.cy = int(random(this.radius, height-this.radius));
      this.xVel= int(random(-5, 5));
      if (this.xVel == 0) {
        this.xVel = 5;
      }
      this.yVel = int(random(-5, 5));
      if (this.yVel == 0) {
        this.yVel = 5;
      }
    }
    else {
      this.cx = x;
      this.cy = y;
      this.xVel = xv;
      this.yVel = yv;
      this.radius = r;
      this.c = color(f);
    }
    this.state = MOVING;
  } //constructor


  move() {
    if (this.cx <= this.radius || this.cx >= (width-this.radius)) {
      this.xVel *= -1;
    }
    if ( this.cy <= this.radius ||
      this.cy > (height-this.radius)) {
      this.yVel *= -1;
    }
    this.cx+= this.xVel;
    this.cy+= this.yVel;
  }

  detect(other) {
    var d = dist(this.cx, this.cy, other.cx, other.cy);
    d = d - (this.radius + other.radius);
    return d <= 0;
  }

  display() {
    fill(this.c);
    circle(this.cx, this.cy, this.radius*2);
  }


  changeState (newState) {
    if (this.state != DEAD) {
      this.state = newState;
    }
  }

  collideState() {
    if (this.state != DEAD) {
      if (this.state != SHRINKING ) {
        if (this.radius <= MAX_SIZE ) {
          this.state = GROWING;
        } else {
          this.state = SHRINKING;
        }
      } else {
        if (this.radius >= MIN_SIZE) {
          this.state = SHRINKING;
        } else {
          this.state = DEAD;
        }
      }
    }
  }

  act() {
    if (this.state == MOVING) {
      this.move();
    } else if (this.state == GROWING) {
      this.radius++;
    } else if (this.state == SHRINKING) {
      this.radius--;
    }
  }
}
