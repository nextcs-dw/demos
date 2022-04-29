var POP_COLS = 6;
var POP_ROWS = 5;
var OFFSET = 1;
var POP_SIZE = POP_COLS * POP_ROWS;
var MAX_SIZE = 127;//exp(2, SIZE_GENE_LENGTH+1) - 1;



class Gene {

  constructor(gl, copycon) {
    if (copycon == undefined) {
      //print("not copy constructor");
      this.geneLength = gl;
      //print(this.geneLength);
      this.genotype = new Array(this.geneLength);
      for (var i=0; i < this.geneLength; i++) {
        this.genotype[i] = int(random(2));
      }//random loop
    }
    else {
      //print("Copy constructor");
      this.geneLength = gl.geneLength;
      this.genotype = new Array(this.geneLength);
      arrayCopy(gl.genotype, this.genotype);
    }
      this.setValue();
  }//constructor

  setValue() {
    this.value = 0;
    for (var i=0; i < this.geneLength; i++) {
      var bit = this.genotype[i];
      this.value+= int( bit * pow(2, i));
    }//random loop
  }//setValue

   mutate() {
     print(this.geneLength);
    var r = int(random(this.geneLength));
    this.genotype[r] = (this.genotype[r] + 1) % 2;
    this.setValue();
  }//mutate

  toString() {
    var s = "";
    for (var i=0; i<this.geneLength; i++) {
      s+= this.genotype[i];
    }
    s+= " " + this.value;
    return s;
  }//toString

} //Gene

var CHROMOSOME_LENGTH = 6;
var SIDES_GENE_LENGTH = 5;
var SIZE_GENE_LENGTH = 6;
var SPIN_GENE_LENGTH = 4;
var COLOR_GENE_LENGTH = 8;

var SIDES_IND = 0;
var SIZE_IND = 1;
var SPIN_IND = 2;
var RED_IND = 3;
var GREEN_IND = 4;
var BLUE_IND = 5;

var MAX_SIDES = 20;

class RegularGon {

  constructor(sides, length, rSpeed, c) {
    this.centroid = [0, 0];
    this.numSides = sides;
    this.gonLength = length;
    this.rotationSpeed = rSpeed;
    this.inside = c;
    this.border = color(0);

    this.xs = new Array(this.numSides);
    this.ys = new Array(this.numSides);
    //bounding box for the shape
    this.topY = this.centroid[1] - this.gonLength;
    this.leftX = this.centroid[0] - this.gonLength;
    this.shapeWidth = this.gonLength;
    this.shapeHeight = this.gonLength;

    this.area = 0;
    this.displayAngle = 0;

    this.generateRegularPolygon();
  }//PathShape

   isValid() {
    return this.xs.size() > 0;
  }//isValid

  generateRegularPolygon() {
    if (this.numSides > 0) {
      var theta = radians(360 / this.numSides);
      for (var n=0; n < this.numSides; n++) {
        var x = int(this.gonLength * cos(n * theta)) + this.centroid[0];
        var y = int(this.gonLength * sin(n * theta)) + this.centroid[1];
        this.xs.push(x);
        this.ys.push(y);
      }
    }
  }//generateRegularPolygon

 display( x,  y) {

    stroke(this.border);
    fill(this.inside);

    push();
    translate(x, y);
    this.displayAngle+= this.rotationSpeed;
    rotate(radians(this.displayAngle));

    beginShape();
    for ( var i = 0; i < this.xs.length; i++ )
      vertex( this.xs[i], this.ys[i] );
    endShape(CLOSE);
    noStroke();
    fill(0, 0, 255);
    circle(this.centroid[0], this.centroid[1], 5);


    //smiley!
    fill(255);
    stroke(0);
    circle(-20, -20, 20);
    circle(20, -20, 20);
    fill(0);
    circle(-20, -20, 5);
    circle(20, -20, 5);

    noFill();
    strokeWeight(4);
    arc(0, 20, 80, 24, 0, PI);
    strokeWeight(1);


    pop();
  }//display

}//RegularGon

class Individual {

  constructor( random) {

    this.chromosome = new Array(CHROMOSOME_LENGTH);
    this.phenotype = 0;
    this.fitness = 0;

    if (random) {
      this.chromosome[SIDES_IND] = new Gene(SIDES_GENE_LENGTH);
      this.chromosome[SIZE_IND] = new Gene(SIZE_GENE_LENGTH);
      this.chromosome[SPIN_IND] = new Gene(SPIN_GENE_LENGTH);
      this.chromosome[RED_IND] = new Gene(COLOR_GENE_LENGTH);
      this.chromosome[GREEN_IND] = new Gene(COLOR_GENE_LENGTH);
      this.chromosome[BLUE_IND] = new Gene(COLOR_GENE_LENGTH);

      this.setPhenotype();
    }
  }//constructor

  setPhenotype() {
    var sides = this.chromosome[SIDES_IND].value;
    var siz = this.chromosome[SIZE_IND].value;
    var spin = this.chromosome[SPIN_IND].value - 7;
    var c = color(this.chromosome[RED_IND].value, this.chromosome[GREEN_IND].value, this.chromosome[BLUE_IND].value);
    this.phenotype = new RegularGon(sides, siz, spin, c);
  }

  setFitness(other) {
    var difference = 0;
    for (var g=0; g < CHROMOSOME_LENGTH; g++) {
      difference+= abs(this.chromosome[g].value - other.chromosome[g].value);
    }
    this.fitness = 10.0 / (10+difference);
  }//setFitness

  mate(partner) {

    var child = new Individual(false);
    var parents = [this, partner];
    var currentParent = int(random(2));
    var crossoverPoint = int(random(CHROMOSOME_LENGTH));
    for (var g=0; g < CHROMOSOME_LENGTH; g++) {
      if (g == crossoverPoint) {
        currentParent = (currentParent+1)%2;
      }
      child.chromosome[g] = new Gene(parents[currentParent].chromosome[g], true);
    }
    child.setPhenotype();
    return child;
  }//mate

   mutate( rate) {
    for (var g=0; g < CHROMOSOME_LENGTH; g++) {
      if (random(1) < rate) {
        this.chromosome[g].mutate();
        this.setPhenotype();
      }
    }
  }//mutate

  display(x, y, showFitness) {
    this.phenotype.display(x, y);
    if (showFitness) {

      //println(fitness);
      textSize(15);
      fill(0);
      textAlign(CENTER);
      text(this.fitness, x, y);
    }
  }//display()

  toString() {
    var s = "";
    for (var i=0; i<CHROMOSOME_LENGTH; i++) {
      s+= this.chromosome[i] + "\n";
    }
    return s;
  }//toString()

}//Individual


var DEFAULT_MUTATION_RATE = 0.05;

class Population {

  constructor(popSize) {
    this.numIndividuals = popSize;
    this.pop = new Array(this.numIndividuals);
    this.omitted = null;
    this.mutationRate = DEFAULT_MUTATION_RATE;
    this.totalFitness = 0;
  }//constructor

  randomPop() {
    for (var p=0; p < this.numIndividuals; p++) {
      this.pop[p] = new Individual(true);
    }
    this.omitted = null;
  }//randomPop


  drawPopGrid(cols, rows, maxSize, offset, showFitness) {
    for (var p=0; p < this.numIndividuals; p++) {
      var x = (p % cols) * (maxSize + offset) + (maxSize + offset) / 2;
      var y = int(p / cols) * (maxSize + offset) + (maxSize + offset) / 2;
      this.pop[p].display(x, int(y), showFitness);
    }
  }//drawPopGrid

  get(index) {
    return this.pop[index];
  }//get

  setOmitted(o) {
    this.omitted = this.pop[o];
  }//setOmitted

  setFitness(target) {
    this.totalFitness = 0;
    this.omitted.fitness = 0;
    for (var p=0; p < this.numIndividuals; p++) {
      if (this.pop[p] != this.omitted) {
        this.pop[p].setFitness(target);
        this.totalFitness+= this.pop[p].fitness;
      }
    }
  }//setFitness

  select() {
    var r = random(this.totalFitness);
    var fitnessCounter = 0;
    var p = -1;
    while (fitnessCounter < r) {
      p++;
      if ( this.omitted == null || this.pop[p] != this.omitted ) {
        fitnessCounter+= this.pop[p].fitness;
      }
    }
    return this.pop[p];
  }//select

  matingSeason( keepBest) {
    var nextGeneration = new Population( this.numIndividuals );
    var bestIndex = -1;
    if (keepBest) {
      bestIndex = this.getBestIndex();
    }
    for (var p=0; p < this.numIndividuals; p++) {
      if (this.pop[p] == this.omitted) {
        nextGeneration.pop[p] = this.pop[p];
      }
      else if (keepBest && (p == bestIndex)) {
        nextGeneration.pop[p] = this.pop[p];
      }
      else {
        var p0 = this.select();
        var p1 = this.select();
        var child = p0.mate(p1);
        child.mutate(this.mutationRate);
        nextGeneration.pop[p] = child;
      }
     //  //print(nextGeneration.pop[p]);
    }
    nextGeneration.omitted = this.omitted;
    return nextGeneration;
  }//matingSeason

  getBestIndex() {
    var best = 0;
    for (var p=1; p < this.numIndividuals; p++) {
      if (this.pop[p] != this.omitted) {
        if (this.pop[p].fitness > this.pop[best].fitness) {
          best = p;
        }
      }
    }
    return best;
  }//getBest

  getBestFitness() {
    return this.pop[this.getBestIndex()].fitness;
  }//getBestFitness

  getAvgFitness() {
    if (this.omitted == null)
      return this.totalFitness / this.numIndividuals;
    else
      return this.totalFitness / (this.numIndividuals-1);
  }

}//Population




var popu;
var target;
var targetX, targetY;
var selected;
var generationCount;

function setup() {
  popu = new Population(POP_SIZE);
  createCanvas(POP_COLS*MAX_SIZE + (POP_COLS-1)*OFFSET, POP_ROWS*MAX_SIZE + (POP_ROWS-1)*OFFSET);

  makePopulation();
}//setup

function draw() {
  background(255);
  popu.drawPopGrid(POP_COLS, POP_ROWS, MAX_SIZE, OFFSET, true);
  drawGrid();
  if (selected) {
    highlightIndividual(targetX, targetY, color(0, 255, 0));
    var bestI = popu.getBestIndex();
    highlightIndividual( (bestI % POP_COLS) * (MAX_SIZE + OFFSET), int((bestI / POP_COLS)) * (MAX_SIZE + OFFSET), color(0, 255, 255));
  }
}//draw

function selectI(x, y) {
  //print(x, y);
  var targetIndex = y * POP_COLS + x;
  target = popu.get(targetIndex);
  popu.omitted = target;
  print(popu.omitted);
  popu.setFitness(target);
  selected = true;
  targetX = x * (MAX_SIZE + OFFSET);
  targetY = y * (MAX_SIZE + OFFSET);
}

function mousePressed() {
  var x = mouseX / (MAX_SIZE + OFFSET);
  var y = mouseY / (MAX_SIZE + OFFSET);
  selectI(int(x), int(y));
}//mousePressed

function keyPressed() {
  if (key == 'p') {
    makePopulation();
  }
  if (key == 'm') {
    generationCount++;
    popu = popu.matingSeason(true);
    popu.setFitness(target);
    print("Generation " + generationCount);
    print("Best fitness: " + popu.getBestFitness());
    print("Avg  fitness: " + popu.getAvgFitness());
  }
}//keyPressed

function makePopulation() {
  popu.randomPop();
  generationCount = 0;
  selected = false;
}//makePopulation()

function highlightIndividual( x,  y,  c) {
  noFill();
  strokeWeight(5);
  stroke(c);
  rect(int(x), int(y), MAX_SIZE, MAX_SIZE);
  strokeWeight(1);
}

function drawGrid() {
  stroke(0);
  for (var i=1; i < POP_COLS; i++) {
    var x = i * (MAX_SIZE + OFFSET);
    line(x, 0, x, height-1);
  }//row dividers

  for (var i=1; i < POP_ROWS; i++) {
    var y = i * (MAX_SIZE + OFFSET);
    line(0, y, width-1, y);
  }//column dividers
}//drawGrid
