int DIRT = 0;
int FIRE = 1;
int BURNT = 2;
int TREE = 3;

int numPlots = 30;
int numRows = 30;

boolean wild = false;
boolean fullGrid;

Land grid[][];

void setup() {
  size(600, 600);
  frameRate(10);
  setupLand(numPlots, numRows, 60);
  showLand();
}

void draw() {
  println(frameRate);
  showLand();
  if (wild) {
    liveFire();
  }
}

void liveFire() {
  int up = DIRT;
  int down = DIRT;
  int left = DIRT;
  int right = DIRT;

  for (int r=0; r<grid.length; r++) {
    for (int p=0; p<grid[r].length; p++) {

      if (p==0) { 
        left = DIRT;
      } else { 
        left = grid[r][p-1].state;
      }
      if (p == grid[r].length-1) {
        right = DIRT;
      } else {
        right = grid[r][p+1].state;
      }
      if (r == 0) { 
        up = DIRT;
      } else { 
        up = grid[r-1][p].state;
      }
      if (r == grid[r].length - 1) { 
        down = DIRT;
      } else { 
        down = grid[r+1][p].state;
      }
      boolean neighborFire = false;

      if (fullGrid) {
        neighborFire = (up == FIRE) || (down == FIRE) || (right == FIRE);
      }
      neighborFire = neighborFire || left == FIRE;
      grid[r][p].updateState(neighborFire);
    }
  }

  for (int r=0; r<grid.length; r++) {
    for (int p=0; p<grid[r].length; p++) {
      grid[r][p].changeState();
    }
  }
}

void showLand() {
  for (int r=0; r<grid.length; r++) {
    for (int p=0; p<grid[r].length; p++) {
      grid[r][p].display();
    }
  }
}

void setupLand(int numPlots, int numRows, float density) {
  grid = new Land[numRows][numPlots];
  int plotSize = width / numPlots;
  int type = DIRT;
  for (int r=0; r<grid.length; r++) {
    for (int p=0; p<grid[r].length; p++) {
      if (p == 0) {
        type = FIRE;
      } else if (random(100) < density) {
        type = TREE;
      } else {
        type = DIRT;
      }
      grid[r][p] = new Land(p*plotSize, r*plotSize, plotSize, type);
    }
  }
}

void keyPressed() {
  wild = !wild;
  if (key == '1') {
    fullGrid = false;
  } else if (key == '4') {
    fullGrid = true;
  }
}
