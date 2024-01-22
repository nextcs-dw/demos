let pg;
let cp;

function setup() {
  createCanvas(800, 600);
  pg = new PaintGrid(3, 3, 200, 200, 0);
  cp = new ColorPicker(0, 0, 200, 600, 12);
}//setup

function draw() {
  background(0);
  pg.display();
  cp.display();
}//draw

function keyPressed() {
  if (key == 'c') {
    pg.resetGrid();
  }
}//keyPressed

function mouseClicked() {
  if (mouseX <200) {
    cp.pickColor(mouseX, mouseY);
  }
}//
function mouseDragged() {
  if (mouseX >= 200) {
    pg.addPoint(mouseX, mouseY);
  }
}//mouseDragged

function mouseReleased() {
  if (mouseX >= 200) {
    pg.endLine();
  }
}//mouseReleased

function mousePressed() {
  if (mouseX >= 200) {
    pg.startLine(mouseX, mouseY, cp.getColor());
  }
  else {
    cp.pickColor(mouseX, mouseY);
  }
}//mousePressed


class PaintGrid {

  constructor(nr, nc, bs, cx, cy) {

    this.numRows = nr;
    this.numCols = nc;
    this.blockSize = bs;
    this.grid = new Array(this.numRows);
    this.resetGrid();
    this.selected = null;
    this.corner = createVector(cx, cy);
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
    push();
    translate(this.corner.x, this.corner.y);
    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].display(false);
      }
    }
    pop();
  }//display();


  addPoint(x, y) {
    let b = this.getBlockFromXY(x, y);

    x = Math.trunc(x - this.corner.x);
    y = Math.trunc(y - this.corner.y);

    let xc = Math.trunc(x / this.blockSize);
    let yr = Math.trunc(y / this.blockSize);

    x = x - (xc*this.blockSize);
    y = y - (yr*this.blockSize);

    if (b != this.selected) {

      let prevLine = this.selected.lines[this.selected.lines.length-1];
      let prev = prevLine.points[prevLine.points.length-1];

      //check if the border crossing is x
      if (abs(prev.x - x) >= this.blockSize/2) {
        if ( prev.x > x ) {
          this.addPointToAll(this.blockSize-1, y);
        }
        else if ( prev.x < x) {
          this.addPointToAll(0, y);
        }
      }
      else {
        if (prev.y > y) {
          this.addPointToAll(x, this.blockSize-1);
        }
        else if (prev.y < y) {
          this.addPointToAll(x, 0);
        }
      }

      //this part works fine
      this.endLine();
      this.startLine(x, y, prevLine.penColor);
      this.selected = b;

      if (abs(prev.x - x) >= this.blockSize/2) {
        if ( prev.x > x ) {
          this.addPointToAll(0, y);
        }
        else if (prev.x < x ) {
          this.addPointToAll(this.blockSize-1, y);
        }
      }
      else {
        if (prev.y > y) {
          this.addPointToAll(x, 0);
        }
        else if (prev.y < y) {
          this.addPointToAll(x, this.blockSize-1);
        }
      }
    }//border crossing


    this.addPointToAll(x, y);
  }//addPoint

  addPointToAll( x,  y) {
    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].addPoint(x, y);
      }
    }
  }//addPointToAll

  startLine(x, y, co) {
    this.selected = this.getBlockFromXY(x, y);
    if (this.selected == null) {
      this.endLine();
      return;
    }

    for (var r=0; r < this.grid.length; r++) {
      for (var c=0; c < this.grid[r].length; c++) {
        this.grid[r][c].startLine(co);
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
    x = Math.trunc((x-this.corner.x) / this.blockSize);
    y = Math.trunc((y-this.corner.y) / this.blockSize);
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
    if (!viewGrid) {
      noStroke();
    }
    else {
      strokeWeight(1);
    }

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

  startLine(c) {
    this.lines.push(new PaintLine(c));
  }
  endLine() {
    this.lines[this.lines.length-1].endLine();
  }//endLine

}//PaintBlock

class PaintLine {

  constructor(c) {
    this.penColor = c;
    this.points = [];
  }//constructor

  drawPoints() {
    stroke(this.penColor);
    strokeWeight(3);
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

class ColorPicker {

  constructor(x, y, pw, ph, numColors) {
    this.corner = createVector(x, y);
    this.pickWidth = pw;
    this.pickHeight = ph;
    this.colors = new Array(numColors);
    this.paintSize = height/ (numColors/2);
    this.populateColors();
    this.selectedColor = 1;
  }//constructor

  display() {
    strokeWeight(1);
    fill(150);
    rect(this.corner.x, this.corner.y, this.pickWidth, this.pickHeight);

    fill(255);
    let x = int(this.corner.x) + this.paintSize/2;
    let y = int(this.corner.y) + this.paintSize/2;
    for (let c=0; c < this.colors.length; c+=2) {
      fill(this.colors[c]);
      circle(x, y, this.paintSize);
      if (c == this.selectedColor) {
        fill(255);
        noStroke();
        circle(x, y, 10);
        stroke(0);
      }
      x+= this.paintSize;
      fill(this.colors[c+1]);
      circle(x, y, this.paintSize);
      if (c+1 == this.selectedColor) {
        fill(255);
        noStroke();
        circle(x, y, 10);
        stroke(1);
      }
      x = int(this.corner.x) + this.paintSize/2;
      y+= this.paintSize;
    }//color circles
  }//display

  populateColors() {
    this.colors[0] = color(255);
    this.colors[1] = color(0);
    this.colors[2] = color(255, 0, 0);
    this.colors[3] = color(255, 127, 0);
    this.colors[4] = color(255, 255, 0);
    this.colors[5] = color(127, 255, 0);
    this.colors[6] = color(0, 255, 0);
    this.colors[7] = color(0, 255, 127);
    this.colors[8] = color(0, 255, 255);
    this.colors[9] = color(0, 127, 255);
    this.colors[10] = color(0, 0, 255);
    this.colors[11] = color(127, 0, 255);
  }//populateColors

  pickColor(x, y) {
    this.selectedColor =int(y/this.paintSize)*2 + int(x/this.paintSize);
    //println(x / paintSize + " " + y / paintSize + " " + index);
  }//pickColor

  getColor() {
    return this.colors[this.selectedColor];
  }//getColor

}//ColorPicker
