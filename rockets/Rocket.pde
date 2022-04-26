// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Pathfinding w/ Genetic Algorithms

class Rocket {

  static final int START_X = 20;
  static final int START_Y = 200;

  // All of our physics stuff
  PVector position;
  PVector velocity;
  PVector acceleration;
  PVector angles[];
  float mags[];
  int moveCount;
  boolean hitObstacle;
  // Size
  float r;


  Rocket(PVector l, int numMoves) {
    acceleration = new PVector();
    velocity = new PVector();
    angles = new PVector[numMoves];
    mags = new float[numMoves];
    position = l.copy();
    moveCount = 0;
    r = 4;
    hitObstacle = false;
  }

  Rocket(PVector[] as, float[] ms, int numMoves) {
    this(new PVector(START_X, START_Y), numMoves);
    angles = as;
    mags = ms;
  }

  void randomMoves() {
    for (int m=0; m < angles.length; m++) {
      float theta = random(TWO_PI);
      angles[m] = new PVector(cos(theta), sin(theta));
      mags[m] = random(0.1);
      //println(moves[m]);
    }
  }

  void reset() {
    acceleration = new PVector();
    velocity = new PVector();
    position = new PVector(START_X, START_Y);
    moveCount = 0;
    hitObstacle = false;
  }//reset

  // Run in relation to all the obstacles
  // If I'm stuck, don't bother updating or checking for intersection
  boolean run(Block obstacles[]) {
    if (!hitObstacle) {
      PVector move = angles[moveCount].copy();
      move.mult(mags[moveCount]);
      applyForce(move);
      moveCount = (moveCount+1) % angles.length;
      update();
    }//free and clear
    if ( ! hitObstacle && checkObstacles(obstacles) ) {
      hitObstacle = true;
    }
    if ( ! hitObstacle && outOfBounds() ) {
      hitObstacle = true;
    }
    return hitObstacle;
  }//run

  boolean outOfBounds() {
    boolean check = position.x < 0 || position.y < 0;
    check = check || position.x > width;
    check = check || position.y > height;
    return check;
  }
  
  boolean checkObstacles(Block obstacles[]) {
    boolean hit = false;
    for (int o=0; o < obstacles.length; o++) {
        hit = obstacles[o].collide(this);
        if (hit) {
          break;
        }
    }
    return hit;
  }//checkObstacles

  void applyForce(PVector f) {
    acceleration.add(f);
  }

  void update() {
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0);
  }

  void display(color c) {
    float theta = velocity.heading() + PI/2;
    
    stroke(0);
    pushMatrix();
    translate(position.x, position.y);
    rotate(theta);

    // Thrusters
    rectMode(CENTER);
    fill(0);
    rect(-r/2, r*2, r/2, r);
    rect(r/2, r*2, r/2, r);

    // Rocket body
    fill(c);
    beginShape(TRIANGLES);
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape();

    popMatrix();
  }

}
