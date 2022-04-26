int NUM_MOVES = 800;
int POP_SIZE = 25;
int NUM_OBSTACLES = 25;

Population pop;
Block target;
Block obstacles[];
boolean moving;
boolean continuous;
int moves;
int generationCount;

void setup() {
  size(800, 400);
  pop = new Population(POP_SIZE);
  reset();
  continuous = false;
}//setup

void draw() {
  background(255);
  if (moving && moves == NUM_MOVES) {
    moving = false;
    pop.setFitness(target);
    println("Generation " + generationCount);
    println("Best fitness: " + pop.getBestFitness());
    println("Avg  fitness: " + pop.getAvgFitness());
    moves++;
  }
  if (continuous ) {
    if (moves > NUM_MOVES) {
      moves++;
    }
    if (moves == NUM_MOVES + 60) {
      pop = pop.matingSeason(true);
      moving = true;
      moves = 0;
      generationCount++;
    }
  }//continuous
  if (moving) {
    pop.run(false, obstacles);
    moves++;
  }
  else {
    pop.display(true);
  }
  displayBlocks();
}//draw

void reset() {
  pop.randomPop();
  target = new Block(Block.TARGET, 780, 200, 15, 15);
  //obstacleSetup();
  randomObstacles();
  moving = true;
  moves = 0;
  generationCount = 0;
}

void displayBlocks() {
  target.display();
  for (int o=0; o < NUM_OBSTACLES; o++) {
    obstacles[o].display();
  }
}//displayBlocks

void obstacleSetup() {
  obstacles = new Block[NUM_OBSTACLES];
  obstacles[0] = new Block(Block.OBSTACLE, 200, 350, 100, 15);
  obstacles[1] = new Block(Block.OBSTACLE, 100, 200, 100, 15);
  obstacles[2] = new Block(Block.OBSTACLE, 300, 200, 100, 15);
  obstacles[3] = new Block(Block.OBSTACLE, 200, 100, 100, 15);

}//obstacleSetup

void randomObstacles() {
  obstacles = new Block[NUM_OBSTACLES];
  int posBound = 0;
  int sizeMin = 10;
  int sizeMax = 50;

  for (int o=0; o < NUM_OBSTACLES; o++) {
    int x = int(random(20, width-sizeMax));
    int y = int(random(posBound, height-sizeMax));
    int w = int(random(sizeMin, sizeMax));
    int h = int(random(sizeMin, sizeMax));
    obstacles[o] = new Block(Block.OBSTACLE, x, y, w, h);
  }
}//randomObstacles

void keyPressed() {
  if (key == 'p') {
    reset();
  }
  else if (key == 'm') {
    pop = pop.matingSeason(true);
    moving = true;
    moves = 0;
    generationCount++;
  }
}//keyPressed
