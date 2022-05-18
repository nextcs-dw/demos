var SPACE = 0;
var WALL = 1;
var START = 2;
var FINISH = 3;
var PATH = 4;
var VISITED = 5;

var m;
var steps;
var mazeLines;

function preload() {
  mazeLines =loadStrings("data/maze.txt");
}

function setup() {
  m = new Maze(mazeLines);
  steps = new MoveList();
  frameRate(20);
  createCanvas(730, 460);

  //size(400, 400);
  //m = new Maze("maze2.txt");
  m.solve(1, 1, steps);
  //print(steps);
  m.display(true);
}


function draw() {

  if (steps.length() > 0 ) {
    var p = steps.remove();
    var cellWidth = width / m.cols;
    var cellHeight = height / m.rows;
    if (p.type == PATH) {
      fill(0, 0, 255);
    } else if (p.type == VISITED) {
      fill(190);
    }
    rect(p.col*cellWidth, p.row*cellHeight, width/m.cols, height/m.rows);
  }
}


class Move {

  constructor(r, c, t) {
    this.row = r;
    this.col = c;
    this.type = t;
  }

  toString() {
    return "(" + this.row + " " + this.col + ")";
  }
}


class MoveList {

  constructor() {
    this.last = 0;
    this.moves = new Array(10);
  }//constructor

  expand() {
    var newList = new Array(this.moves.length * 2);
    for (var m=0; m<this.moves.length; m++) {
      newList[m] = this.moves[m];
    }//copy values
    this.moves = newList;
  }//expand

  add(m) {
    if (this.last == this.moves.length) {
      this.expand();
    }//expand
    this.moves[this.last] = m;
    this.last++;
  }//add

  remove() {
    var v = this.moves[0];
    for (var m=0; m < this.last-1; m++) {
      this.moves[m] = this.moves[m+1];
    }//slide values down
    this.last--;
    return v;
  }//remove

  length() {
    return this.last;
  }

  toString() {
    var s = "[ ";
    for (var m=0; m<this.last; m++) {
      s+= this.moves[m] + " ";
    }
    s+= "]";
    return s;
  }//toString
}


class Maze {


  constructor(lines) {
    this.rows = lines.length;
    this.cols = lines[0].length;
    this.grid = new Array(this.rows);

    for (var r=0; r < this.grid.length; r++) {
      this.grid[r] = new Array(this.cols);
      for (var c=0; c < this.grid[r].length; c++) {
        var spot = SPACE;
        if (lines[r].charAt(c) == '#') {
          spot = WALL;
        }//wall
        else if (lines[r].charAt(c) == '?') {
          spot = START;
        }//start
        else if (lines[r].charAt(c) == '$') {
          spot = FINISH;
        }
        this.grid[r][c] = spot;
      }//cols
    } //rows
  }//constructor

  display(blank) {
    var cellWidth = width / this.cols;
    var cellHeight = height / this.rows;

    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        var spot = this.grid[r][c];
        if (spot == WALL) {
          fill(0);
        }//wall fill
        else if (spot == SPACE) {
          fill(255);
        }//space fill
        else if (spot == START ) {
          fill(0, 255, 0);
        }//start fill
        else if (spot == FINISH) {
          fill(255, 0, 0);
        }//end fill
        else if ( blank ) {
          fill(255);
        }//blank ignores current and visited
        else {
          if (spot == PATH) {
            fill(0, 0, 255);
          } else if (spot == VISITED) {
            fill(190);
          }
        }//no blank, fill in current & visited
        rect(c*cellWidth, r*cellHeight, cellWidth, cellHeight);
      }//cols
    }//rows
  }//display


  solve(cRow, cCol, steps) {

    var  currentSpot = this.grid[cRow][cCol];
    if ( currentSpot == FINISH ) {
      steps.add( new Move(cRow, cCol, currentSpot));
      return true;
    }//done
    if (currentSpot == WALL || currentSpot == VISITED || currentSpot == PATH) {
      return false;
    }//dead end

    this.grid[cRow][cCol] = PATH;
    steps.add( new Move(cRow, cCol, PATH));
    var solved = this.solve(cRow, cCol+1, steps);
    if (!solved) {
      solved = this.solve(cRow-1, cCol, steps);
    }
    if (!solved) {
      solved = this.solve(cRow, cCol-1, steps);
    }
    if (!solved) {
      solved = this.solve(cRow+1, cCol, steps);
    }
    if (!solved) {
      this.grid[cRow][cCol] = VISITED;
      steps.add( new Move(cRow, cCol, VISITED));
    }
    return solved;
  }
}
