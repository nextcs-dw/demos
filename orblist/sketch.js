var SPRING_LEN = 50;
var SPRING_CONST = 0.005;
var DAMPING = 0.995;
var PART_SIZE = 15;

class OrbNode {

  constructor(x, y) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.osize = PART_SIZE;
    this.c = color(240, 140, 40);
    this.mass = 0;
    this.next = null;
    this.previous = null;
  }//constructor

  contains(p) {
    var d = this.position.dist(p);
    return d <= this.osize;
  }//contains

  embiggen(factor) {
    this.osize+= factor;
  }//embiggen

  run() {
    this.acceleration.mult(this.osize/PART_SIZE);
    this.velocity.add(this.acceleration);
    this.velocity.mult(DAMPING);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    if (this.checkYBounds()) {
      this.velocity.y*= -1;
      this.position.y+= this.velocity.y;
    }
    if (this.checkXBounds()) {
      this.velocity.x*= -1;
      this.position.x+= this.velocity.x;
    }
  }//run

  applyForce(f) {
    this.acceleration.add(f);
  }//applyForce

  checkYBounds() {
    var check = this.position.y <= this.osize/2;
    check = check || this.position.y >= this.height - this.osize/2;
    return check;
  }//checkYBounds
  checkXBounds() {
    var check = this.position.x <= this.osize/2;
    check = check || this.position.x >= this.width - this.osize/2;
    return check;
  }//checkXBounds

  display() {
    if (this.next != null) {
      stroke(40, 200, 190);
      line(this.position.x+1, this.position.y+1, this.next.position.x+1, this.next.position.y+1);
    }
    if (this.previous != null) {
      stroke(210, 50, 150);
      line(this.position.x-1, this.position.y-1, this.previous.position.x-1, this.previous.position.y-1);
    }
    stroke(0);
    fill(this.c);
    circle(this.position.x, this.position.y, this.osize);
  }//display

  toString() {
    return this.position.toString();
  }//toString

  applySpringForce() {
    if (this.next != null) {
      this.velocity.add(this.calculateSpringForce(this.next));
    }
    if (this.previous != null) {
      this.velocity.add(this.calculateSpringForce(this.previous));
    }
  }//applySpringForce


  calculateSpringForce(other) {
    var dist = this.position.dist(other.position);
    var displacement = dist - SPRING_LEN;
    var springForce = displacement * SPRING_CONST;

    var xDiff = other.position.x - this.position.x;
    var yDiff = other.position.y - this.position.y;
    var xForce = springForce * xDiff/dist;
    var yForce = springForce * yDiff/dist;

    return new p5.Vector(xForce, yForce);
  }//calculateSpringForce
}//OrbNode

class FixedOrb extends OrbNode {

  constructor(x, y) {
    super(x, y);
  }//constructor

  run() {
    this.acceleration.mult(0);
  }//run
}//FixedOrb


class OrbList {

  constructor(x0, y0, x1, y1) {
    this.front = new FixedOrb(x0, y0);
    this.back = new FixedOrb(x1, y1);
    this.front.next = this.back;
    this.back.previous = this.front;
  }//constructor

  findNextNode(x) {
    var current = this.front.next;
    while (current != this.back && current.position.x < x) {
      current = current.next;
    }
    return current;
  }//findNextNode

  insertBefore(n, x, y, fixed) {
    var o;
    if (fixed) {
      o = new FixedOrb(x, y);
    }
    else {
      o = new OrbNode(x, y);
    }
    o.next = n;
    o.previous = n.previous;
    o.previous.next = o;
    n.previous = o;
  }//insertBefore

  addFront(x, y, fixed) {
    var o;
    if (fixed) {
      o = new FixedOrb(x, y);
    }
    else {
      o = new OrbNode(x, y);
    }
    o.next = this.front.next;
    this.front.next.previous = o;
    o.previous = this.front;
    this.front.next = o;
  }//addFront

  append(x, y, fixed) {
    var o;
    if (fixed) {
      o = new FixedOrb(x, y);
    }
    else {
      o = new OrbNode(x, y);
    }
    o.previous = this.back.previous;
    this.back.previous.next = o;
    o.next = this.back;
    this.back.previous = o;
  }//append


  removeNode(pn) {
    pn.next.previous = pn.previous;
    pn.previous.next = pn.next;
    pn.next = null;
    pn.previous = null;
  }//removeNode

  selectNode(x, y) {
    var current = this.front.next;
    while (current != this.back) {
      if (current.contains(new p5.Vector(x, y))) {
        return current;
      }
      current = current.next;
    }
    return null;
  }//selectNode

  display() {
    print(this.toString());
    var current = this.front;
    while (current != null) {
      current.display();
      current = current.next;
    }
  }//display

  applySprings() {
    var current = this.front;
    while (current != null) {
      current.applySpringForce();
      current = current.next;
    }
  }//applySprings

  applyExternalForce(force) {
    var current = this.front;
    while (current != null) {
      current.applyForce(force);
      current = current.next;
    }
  }//applyExternalForce

  run() {
    var current = this.front;
    while (current != null) {
      current.run();
      current = current.next;
    }
  }//run

  toString() {
    var s = "";
    var current = this.front;
    while (current != null) {
      s+= current;
      current = current.next;
    }
    return s;
  }//toString

}//ParticeList

var DELETE_MODE = 0;
var GROW_MODE = 1;
var SHRINK_MODE = 2;
var ADD_FIXED_MODE = 3;
var clickMode;

var moving;
var slinky;
var GRAVITY = 0.2;
var g;

function setup() {
  createCanvas(500, 500);
  clickMode = DELETE_MODE;
  moving = false;
  g = new p5.Vector(0, GRAVITY);
  slinky = makeSlinky(2, 100);
  print(slinky);
}//setup

function draw() {
  background(255);
  if (moving) {
    slinky.applyExternalForce(g);
    slinky.applySprings();
    slinky.run();
  }
  slinky.display();
  displayMode();
}//draw


function makeSlinky(numParts, y) {
  slinky = new OrbList(50, y, 450, y);
  var nodeSpace = (450 - 50) / (numParts+1);
  var x = 50 + nodeSpace;
  for (var i=0; i < numParts; i++) {
      slinky.append(x, y, false);
      x+= nodeSpace;
  }
  return slinky
}//makeSlinky

function keyPressed() {
  if (key == ' ') {
    moving = !moving;
  }
  if (key == 'r') {
    slinky = makeSlinky(2, 100);
  }
  if (key == 'm') {
    clickMode = (clickMode+1)%4;
  }
}//keyPressed


function mousePressed() {
  var selected = slinky.selectNode(mouseX, mouseY);
  if (selected != null) {
    if (clickMode == DELETE_MODE) {
      slinky.removeNode(selected);
    }
    else if (clickMode == GROW_MODE) {
      selected.embiggen(1);
    }
    else if (clickMode == SHRINK_MODE) {
      selected.embiggen(-1);
    }
  }//current node selected
  else {
    var fixed = clickMode == ADD_FIXED_MODE;
    var n = slinky.findNextNode(mouseX);
    slinky.insertBefore(n, mouseX, mouseY, fixed);

  }
}//mousePressed


function displayMode() {
  var message = "DELETE_MODE";
  if (clickMode == GROW_MODE) {
    message = "GROW MODE";
  }
  else if (clickMode == SHRINK_MODE) {
    message = "SHRINK MODE";
  }
  else if (clickMode == ADD_FIXED_MODE) {
    message = "ADD FIXED MODE";
  }
  fill(0);
  textSize(20);
  text(message, 10, height-10);
}
