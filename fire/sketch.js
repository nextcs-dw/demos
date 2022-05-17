var DIRT = 0;
var FIRE = 1;
var BURNT = 2;
var TREE = 3;

var numPlots = 100;
var numRows = 100;

var wild = false;
var fullGrid;

var grid;

function setup() {
  createCanvas(600, 600);
  frameRate(10);
  setupLand(numPlots, numRows, 60);
  showLand();
}

function draw() {
  //print(frameRate);
  showLand();
  if (wild) {
    liveFire();
  }
}

function liveFire() {
  var up = DIRT;
  var down = DIRT;
  var left = DIRT;
  var right = DIRT;

  for (var r=0; r<grid.length; r++) {
    for (var p=0; p<grid[r].length; p++) {

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
      var neighborFire = false;

      if (fullGrid) {
        neighborFire = (up == FIRE) || (down == FIRE) || (right == FIRE);
      }
      neighborFire = neighborFire || left == FIRE;
      grid[r][p].updateState(neighborFire);
    }
  }

  for (var r=0; r<grid.length; r++) {
    for (var p=0; p<grid[r].length; p++) {
      grid[r][p].changeState();
    }
  }
}

function showLand() {
  for (var r=0; r<grid.length; r++) {
    for (var p=0; p<grid[r].length; p++) {
      grid[r][p].display();
    }
  }
}

function setupLand(numPlots, numRows, density) {
  grid = new Array(numRows);
  var plotSize = width / numPlots;
  var type = DIRT;
  for (var r=0; r<grid.length; r++) {
    grid[r] = new Array(numPlots);
    for (var p=0; p<grid[r].length; p++) {
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

function keyPressed() {
  wild = !wild;
  if (key == '1') {
    fullGrid = false;
  } else if (key == '4') {
    fullGrid = true;
  }
}


class Land {

  constructor(_x, _y, sz, st) {
    this.x = _x;
    this.y = _y;
    this.size = sz;
    this.state = st;
    this.nextState = st;
  }

  display() {
    noStroke();
    if (this.state == DIRT) {
      fill('#81582F');
    } else if (this.state == FIRE) {
      fill('#F20C0C');
    } else if (this.state == BURNT) {
      fill('#810707');
    } else if (this.state == TREE) {
      fill('#49B90D');
    }
    square(this.x, this.y, this.size);
  }

  updateState(neighbor) {
    if (this.state == FIRE) {
      this.nextState = BURNT;
    } else if (this.state == TREE && neighbor.state == FIRE) {
      this.nextState = FIRE;
    } else {
      this.nextState = this.state;
    }
  }

  updateState(neighborFire) {
    if (this.state == FIRE) {
      this.nextState = BURNT;
    } else if (this.state == TREE && neighborFire) {
      this.nextState = FIRE;
    } else {
      this.nextState = this.state;
    }
  }


  updateState (up, down, left, right) {
    if (this.state == FIRE) {
      this.nextState = BURNT;
    }
    else if (this.state == TREE) {
      if ( (up == FIRE) ||
        (down == FIRE) ||
        (left == FIRE) ||
        (right == FIRE)) {
        this.nextState = FIRE;
      }
      else {
        this.nextState = TREE;
      }
    }
    else {
      this.nextState = this.state;
    }
  }
  changeState() {
    this.state = this.nextState;
  }
};
