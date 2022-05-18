class Maze {

  int rows;
  int cols;
  int grid[][];

  Maze(String file) {
    String[] lines = loadStrings(file);
    rows = lines.length;
    cols = lines[0].length();

    grid = new int[rows][cols];
    for (int r=0; r < grid.length; r++) {
      for (int c=0; c < grid[r].length; c++) {
        int spot = SPACE;
        if (lines[r].charAt(c) == '#') {
          spot = WALL;
        }//wall
        else if (lines[r].charAt(c) == '?') {
          spot = START;
        }//start
        else if (lines[r].charAt(c) == '$') {
          spot = FINISH;
        }
        grid[r][c] = spot;
      }//cols
    } //rows
  }//constructor

  void display(boolean blank) {
    int cellWidth = width / cols;
    int cellHeight = height / rows;

    for (int r=0; r < grid.length; r++) {
      for (int c=0; c < grid[r].length; c++) {
        if (grid[r][c] == WALL) {
          fill(0);
        }//wall fill
        else if (grid[r][c] == SPACE) {
          fill(255);
        }//space fill
        else if (grid[r][c] == START ) {
          fill(0, 255, 0);
        }//start fill
        else if (grid[r][c] == FINISH) {
          fill(255, 0, 0);
        }//end fill
        else if ( blank ) {
          fill(255);
        }//blank ignores current and visited
        else {
          if (grid[r][c] == PATH) {
            fill(0, 0, 255);
          } else if (grid[r][c] == VISITED) {
            fill(190);
          }
        }//no blank, fill in current & visited
        rect(c*cellWidth, r*cellHeight, cellWidth, cellHeight);
      }//cols
    }//rows
  }//display

  boolean solve(int cRow, int cCol, MoveList steps) {

    int currentSpot = grid[cRow][cCol];
    if ( currentSpot == FINISH ) {
      steps.add( new Move(cRow, cCol, currentSpot));
      return true;
    }//done
    if (currentSpot == WALL || currentSpot == VISITED || currentSpot == PATH) {
      return false;
    }//dead end

    grid[cRow][cCol] = PATH;
    steps.add( new Move(cRow, cCol, PATH));
    boolean solved = solve(cRow, cCol+1, steps);
    if (!solved) {
      solved = solve(cRow-1, cCol, steps);
    }
    if (!solved) {
      solved = solve(cRow, cCol-1, steps);
    }
    if (!solved) {
      solved = solve(cRow+1, cCol, steps);
    }
    if (!solved) {
      grid[cRow][cCol] = VISITED;
      steps.add( new Move(cRow, cCol, VISITED));
    }
    return solved;
  }
}
