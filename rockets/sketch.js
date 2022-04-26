var NUM_MOVES = 800;
var POP_SIZE = 25;
var NUM_OBSTACLES = 25;

var popu;
var target;
var obstacles;
var moving;
var continuous;
var moves;
var generationCount;

function setup() {
  createCanvas(800, 400);
  popu = new Population(POP_SIZE);
  popreset();
  continuous = true;
}//setup

function draw() {
  background(255);
  if (moving && moves == NUM_MOVES) {
    moving = false;
    popu.setFitness(target);
    print("Generation " + generationCount);
    print("Best fitness: " + popu.getBestFitness());
    print("Avg  fitness: " + popu.getAvgFitness());
    moves++;
  }
  if (continuous ) {
    if (moves > NUM_MOVES) {
      moves++;
    }
    if (moves == NUM_MOVES + 60) {
      popu = popu.matingSeason(true);
      moving = true;
      moves = 0;
      generationCount++;
    }
  }//continuous
  if (moving) {
    popu.run(false, obstacles);
    moves++;
  }
  else {
    popu.display(false);
  }
  displayBlocks();
}//draw

function popreset() {
  popu.randomPop();
  target = new Block(780, 200, 15, 15, TARGET);
  //obstacleSetup();
  randomObstacles();
  moving = true;
  moves = 0;
  generationCount = 0;
}

function displayBlocks() {
  target.display();
  for (var o=0; o < NUM_OBSTACLES; o++) {
    obstacles[o].display();
  }
}//displayBlocks

function obstacleSetup() {
  obstacles = new Array(NUM_OBSTACLES);
  obstacles[0] = new Block(200, 350, 100, 15, OBSTACLE);
  obstacles[1] = new Block(100, 200, 100, 15, OBSTACLE);
  obstacles[2] = new Block(300, 200, 100, 15, OBSTACLE);
  obstacles[3] = new Block(200, 100, 100, 15, OBSTACLE);

}//obstacleSetup

function randomObstacles() {
  obstacles = new Array(NUM_OBSTACLES);
  var posBound = 0;
  var sizeMin = 10;
  var sizeMax = 50;

  for (var o=0; o < NUM_OBSTACLES; o++) {
    var x = int(random(20, width-sizeMax));
    var y = int(random(posBound, height-sizeMax));
    var w = int(random(sizeMin, sizeMax));
    var h = int(random(sizeMin, sizeMax));
    obstacles[o] = new Block(x, y, w, h, OBSTACLE);
  }
}//randomObstacles

function keyPressed() {
  if (key == 'p') {
    popreset();
  }
  else if (key == 'm') {
    popu = popu.matingSeason(true);
    moving = true;
    moves = 0;
    generationCount++;
  }
}//keyPressed


var TARGET = 0;
var OBSTACLE = 1;

class Block {

  constructor( maxX,  maxY,  maxW,  maxH, t) {
    if (t ==undefined ) {
      this.type = OBSTACLE;
      this.y = int(random(maxY));
      this.wSize = int(random(10, maxW));
      this.hSize = int(random(10, maxH));
    }
    else {
      this.type = t;
      this.x = maxX;
      this.y = maxY;
      this.wSize = maxW;
      this.hSize = maxH;
    }
  }

  display() {
    rectMode(CORNER);
    if (this.type == TARGET) {
      fill(255, 255, 0);
    }
    else {
      fill(190);
    }
    rect(this.x, this.y, this.wSize, this.hSize);
  }//display()

  collide(racoon) {
    var hit = racoon.position.x >= this.x && racoon.position.x <= this.x+this.wSize;
    hit = hit && racoon.position.y >= this.y && racoon.position.y <= this.y+this.hSize;
    return hit;
  }//collide
}//Block

/*
  A Gene is designed to store "genetic" data for
  a single trait to be used in a genetic algorithm.

  The main part of the gene is the genotype, which
  is an array representation of a binary number. The
  length of the array will determine the number of digits
  and as a result, the maximum possible value of the Gene.
  So a Gene of legth 5 has a maximum value of
  11111 base 2, or 31.
*/

class Gene {

  constructor(gl, copycon) {
    if (copycon == undefined) {
      this.geneLength = gl;
      this.genotype = new Array(this.geneLength);
      for (var i=0; i < this.geneLength; i++) {
        this.genotype[i] = int(random(2));
      }//random loop
    }
    else {
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


var CHROMOSOME_LENGTH = NUM_MOVES * 2;
var MOVE_GENE_LENGTH = 5;
var MAX_FORCE = 0.1;

class Individual {

  constructor(random) {

    this.chromosome = new Array(CHROMOSOME_LENGTH);
    this.fitness = 0;
    this.hitObstacle = false;
    this.c = color(0, 0, 0);
    this.phenotype = 0;

    if (random) {
      for (var g=0; g<this.chromosome.length; g++) {
        this.chromosome[g] = new Gene(MOVE_GENE_LENGTH);
      }
      this.setPhenotype();
    }
  }//constructor

  setPhenotype() {
    this.c = color(random(256), random(256), random(256));
    var angles = new Array(CHROMOSOME_LENGTH/2);
    var mags = new Array(CHROMOSOME_LENGTH/2);
    var valCount = 0;
    for (var g=0; g<CHROMOSOME_LENGTH; g+=2) {
      var theta = this.chromosome[g].value / pow(2, MOVE_GENE_LENGTH);
      theta = radians(360*theta);
      angles[valCount] = new p5.Vector(cos(theta), sin(theta) );
      var mag = this.chromosome[g+1].value / pow(2, MOVE_GENE_LENGTH);
      mag *= MAX_FORCE;
      mags[valCount] = mag;
      valCount++;
    }
    this.phenotype = new Rocket(CHROMOSOME_LENGTH/2, angles, mags);
  }

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

  setFitness(goal) {
    var d = dist(this.phenotype.position.x, this.phenotype.position.y, goal.x, goal.y);
    //fitness = pow(1/d, 2);
    this.fitness = 10/(10+d);
    if ( this.hitObstacle ) {
      this.fitness*= 0.1;
    }
    //print(fitness);
  }//setFitness

  mutate(rate) {
    for (var g=0; g < CHROMOSOME_LENGTH; g++) {
      if (random(1) < rate) {
        this.chromosome[g].mutate();
        this.setPhenotype();
      }
    }
  }//mutate

  run(showFitness, obstacles) {
    this.hitObstacle = this.phenotype.run(obstacles);
    this.display(showFitness);
  }

  display( showFitness) {
    this.phenotype.display(this.c);
    if (showFitness) {

      //print(fitness);
      textSize(15);
      fill(0);
      textAlign(CENTER);
      text(this.fitness, this.phenotype.position.x, this.phenotype.position.y);
    }
  }//display()

  toString() {
    var s = "[ ";
    for (var i=0; i<CHROMOSOME_LENGTH; i++) {
      s+= this.chromosome[i].value + " ";
    }
    return s + "]";
  }//toString()

}//Individual

var DEFAULT_MUTATION_RATE = 0.05;
class Population {


  constructor(popSize) {
    this.numIndividuals = popSize;
    this.pop = new Array(this.numIndividuals);
    this.mutationRate = DEFAULT_MUTATION_RATE;
    this.totalFitness = 0;
  }//constructor

  randomPop() {
    for (var p=0; p < this.numIndividuals; p++) {
      this.pop[p] = new Individual(true);
    }
  }//randomPop

  run(showFitness, obstacles) {
    for (var p=0; p < this.numIndividuals; p++) {
      this.pop[p].run(showFitness, obstacles);
    }
  }//

  display(showFitness) {
    for (var p=0; p < this.numIndividuals; p++) {
      this.pop[p].display(showFitness);
    }
  }//

  get(index) {
    return this.pop[index];
  }//get


  setFitness( target) {
    this.totalFitness = 0;
    for (var p=0; p < this.numIndividuals; p++) {
      this.pop[p].setFitness(target);
      this.totalFitness+= this.pop[p].fitness;
    }
  }//setFitness

  select() {
    var r = random(this.totalFitness);
    var fitnessCounter = 0;
    var p = -1;
    while (fitnessCounter < r) {
      p++;
      fitnessCounter+= this.pop[p].fitness;
    }
    return this.pop[p];
  }//select

  tournamentSelect() {
    var p0 = int(random(this.numIndividuals));
    var p1 = int(random(this.numIndividuals));
    while (p1 == p0) {
      p1 = int(random(this.numIndividuals));
    }
    if (this.pop[p0].fitness > this.pop[p1].fitness) {
      return this.pop[p0];
    }
    else {
      return this.pop[p1];
    }
  }//tournamentSelect


  matingSeason(keepBest) {
    var nextGeneration = new Population( this.numIndividuals );
    var bestIndex = -1;
    if (keepBest) {
      bestIndex = this.getBestIndex();
    }
    for (var p=0; p < this.numIndividuals; p++) {
      if (keepBest && (p == bestIndex)) {
        this.pop[p].phenotype.rocketreset();
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
    return nextGeneration;
  }//matingSeason

  getBestIndex() {
    var best = 0;
    for (var p=1; p < this.numIndividuals; p++) {
      if (this.pop[p].fitness > this.pop[best].fitness) {
        best = p;
      }
    }
    return best;
  }//getBest

  getBestFitness() {
    return this.pop[this.getBestIndex()].fitness;
  }//getBestFitness

  getAvgFitness() {
    return this.totalFitness / this.numIndividuals;
  }
}//Population


var START_X = 20;
var START_Y = 200;

class Rocket {

  constructor(numMoves, as, ms) {
    this.acceleration = new p5.Vector();
    this.velocity = new p5.Vector();
    this.moveCount = 0;
    this.r = 4;
    this.hitObstacle = false;
    if (ms == undefined) {

      this.angles = new Array(numMoves);
      this.mags = new array(numMoves);
      this.position = as.copy();
    }
    else {
      this.angles = as;
      this.mags = ms;
      this.position = new p5.Vector(START_X, START_Y);
    }
  }

  randomMoves() {
    for (var m=0; m < this.angles.length; m++) {
      var theta = random(TWO_PI);
      this.angles[m] = new p5.Vector(cos(theta), sin(theta));
      this.mags[m] = random(0.1);
      //print(moves[m]);
    }
  }

  rocketreset() {
    this.acceleration = new p5.Vector();
    this.velocity = new p5.Vector();
    this.position = new p5.Vector(START_X, START_Y);
    this.moveCount = 0;
    this.hitObstacle = false;
  }//reset

  // Run in relation to all the obstacles
  // If I'm stuck, don't bother updating or checking for intersection
  run(obstacles) {
    if (!this.hitObstacle) {
      var move = this.angles[this.moveCount].copy();
      move.mult(this.mags[this.moveCount]);
      this.applyForce(move);
      this.moveCount = (this.moveCount+1) % this.angles.length;
      this.update();
    }//free and clear
    if ( ! this.hitObstacle && this.checkObstacles(obstacles) ) {
      this.hitObstacle = true;
    }
    if ( ! this.hitObstacle && this.outOfBounds() ) {
      this.hitObstacle = true;
    }
    return this.hitObstacle;
  }//run

  outOfBounds() {
    var check = this.position.x < 0 || this.position.y < 0;
    check = check || this.position.x > width;
    check = check || this.position.y > height;
    return check;
  }

  checkObstacles(obstacles) {
    var hit = false;
    for (var o=0; o < obstacles.length; o++) {
        hit = obstacles[o].collide(this);
        if (hit) {
          break;
        }
    }
    return hit;
  }//checkObstacles

  applyForce(f) {
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display(c) {
    var theta = this.velocity.heading() + PI/2;

    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

    // Thrusters
    rectMode(CENTER);
    fill(0);
    rect(-this.r/2, this.r*2, this.r/2, this.r);
    rect(this.r/2, this.r*2, this.r/2, this.r);

    // Rocket body
    fill(c);
    beginShape(TRIANGLES);
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape();

    pop();
  }

}
