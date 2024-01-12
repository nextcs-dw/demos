let pg;


function setup() {
  createCanvas(600, 600);
  pg = new PaintGrid(3, 3, 200);
}//setup

function draw() {
  background(0);
  pg.display();

}//draw

function keyPressed() {
  if (key == 'c') {
    pg.resetGrid();
  }
}//keyPressed

function mouseDragged() {
  pg.addPoint(mouseX, mouseY);
}//mouseDragged

function mouseReleased() {
  pg.endLine();
}//mouseReleased

function mousePressed() {
  pg.startLine(mouseX, mouseY);
}//mousePressed


class PaintGrid {

  constructor(nr, nc, bs) {

    this.numRows = nr;
    this.numCols = nc;
    this.blockSize = bs;
    this.grid = new Array(this.numRows);
    this.resetGrid();
    this.selected = null;
  }//constructor

  resetGrid() {
    this.selected = null;
    for (var r=0; r < this.grid.length; r++) {
      this.grid[r] = new Array(this.numCols);
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c] = new PaintBlock(this.blockSize*c, this.blockSize*r, this.blockSize);
      }
    }
  }//resetGrid

  display() {
    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].display(false);
      }
    }
  }//display();


  addPoint(x, y) {
    let b = this.getBlockFromXY(x, y);

    let xc = Math.trunc(x / this.blockSize);
    let yr = Math.trunc(y / this.blockSize);

    x = x - (xc*this.blockSize);
    y = y - (yr*this.blockSize);

    if (b != this.selected) {
      this.endLine();
      this.startLine(x, y);
      this.selected = b;
    }
    this.addPointToAll(x, y);
  }//addPoint

  addPointToAll( x,  y) {
    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].addPoint(x, y);
      }
    }
  }//addPointToAll

  startLine(x, y) {
    this.selected = this.getBlockFromXY(x, y);
    if (this.selected == null) {
      this.endLine();
      return;
    }

    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].startLine();
      }
    }
  }//startLine


  endLine() {
    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].endLine();
      }
    }
  }//endLine

  getBlockFromXY(x, y) {
    x = Math.trunc(x / this.blockSize);
    y = Math.trunc(y / this.blockSize);
    if (y >= this.grid.length || x >= this.grid[0].length ||
        y < 0 || x < 0) {
      return null;
    }
    return this.grid[y][x];
  }
}//PaintGrid

class PaintBlock {

  constructor(x, y, l) {
    this.corner = createVector(x, y);
    this.length = l;
    this.defBackground = color(255);
    this.lines = [];
    this.angle = 0;
  }//constructor

  display(viewGrid) {
    if (!viewGrid)
      noStroke();
    fill(this.defBackground);
    square(this.corner.x, this.corner.y, this.length);

    push();
    translate(this.corner.x, this.corner.y);
    //rotate(angle);
    for (const l of this.lines) {
      l.drawPoints();
    }
    pop();
  }//display

  addPoint(x, y) {
    //println("adding point " + points.size());
    //x = int(x+corner.x);
    //y = int(y+corner.y);
    this.lines[this.lines.length-1].addPoint(x, y);
  }//addPoint

  startLine() {
    this.lines.push(new PaintLine());
  }
  endLine() {
    this.lines[this.lines.length-1].endLine();
  }//endLine

}//PaintBlock

class PaintLine {

  constructor() {
    this.penColor = color(0);
    this.points = [];
  }//constructor

  drawPoints() {
    stroke(this.penColor);
    for (let i=0; i<this.points.length-1; i++) {
      //print(this.points[i]);
      line(this.points[i].x, this.points[i].y,
           this.points[i+1].x, this.points[i+1].y);
    }
  }//drawPoints

  addPoint(x, y) {
    //println("adding point " + points.size());
    this.points.push(createVector(x, y));
  }//addPoint

  endLine() {
    this.points.push(this.points[this.points.length-1]);
  }//endLine
}//PaintLine
