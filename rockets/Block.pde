class Block {

  static final int TARGET = 0;
  static final int OBSTACLE = 1;

  int type;
  int x;
  int y;
  int wSize;
  int hSize;

  Block(int maxX, int maxY, int maxW, int maxH) {
    type = OBSTACLE;
    x = int(random(maxX));
    y = int(random(maxY));
    wSize = int(random(10, maxW));
    hSize = int(random(10, maxH));
  }

  Block(int t, int px, int py, int w, int h) {
    type = t;
    x = px;
    y = py;
    wSize = w;
    hSize = h;
  }//constructor

  void display() {
    rectMode(CORNER);
    if (type == TARGET) {
      fill(255, 255, 0);
    }
    else {
      fill(190);
    }
    rect(x, y, wSize, hSize);
  }//display()

  boolean collide(Rocket racoon) {
    boolean hit = racoon.position.x >= x && racoon.position.x <= x+wSize;
    hit = hit && racoon.position.y >= y && racoon.position.y <= y+hSize;
    return hit;
  }//collide

}//Block
