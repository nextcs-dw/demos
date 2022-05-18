int SPACE = 0;
int WALL = 1;
int START = 2;
int FINISH = 3;
int PATH = 4;
int VISITED = 5;

Maze m;
MoveList steps;

void setup() {
  steps = new MoveList();
  frameRate(10);
  size(730, 460);
  m = new Maze("maze.txt");

  //size(400, 400);
  //m = new Maze("maze2.txt");
  m.solve(1, 1, steps);
  println(steps);
  m.display(true);
}

void draw() {

  if (steps.length() > 0 ) {
    Move p = steps.remove();
    int cellWidth = width / m.cols;
    int cellHeight = height / m.rows;
    if (p.type == PATH) {
      fill(0, 0, 255);
    } else if (p.type == VISITED) {
      fill(190);
    }
    rect(p.col*cellWidth, p.row*cellHeight, width/m.cols, height/m.rows);
  }

}
