
var expBox = document.getElementById("expression");

var PART_SIZE = 40;
var DEFAULT_C = '#FFF08C28';

var PLUS = 0;
var MINUS = 1;
var TIMES = 2;
var DIVIDE = 3;
var VAL = 4;

var Y_SPACE = 75;
var PRE = 0;
var POST = 1;
var IN = 2;
var MAX_DEPTH = 5;
var RAND_TREE = 4;

var fir;
var prefix = "+ - * 80.0 66.0 36.0 * 58.0 - 36.0 51.0";
var prefix2 = "(+ (- (* 80.0 66.0) 36.0) (* 58.0 (- 36.0 51.0)))";
var infix = "((22.0 - (43.0 + (52.0 - 62.0))) + (4.0 * 72.0))";

function setup() {
  createCanvas(800, 400);
  background(200);

  fir = new ExpressionTree(400, 20, 4, false, RAND_TREE);
  //fir = new ExpressionTree(400, 20, infix, ExpressionTree.IN);
  //fir = new ExpressionTree(400, 20, prefix2, ExpressionTree.PRE);

  fir.evaluate();
  fir.display();

  //print(fir.traverse(IN));
  //print(fir.traverse(PRE));
  //print(fir.traverse(POST));


  //println(expressionToList(infix));
  //println(expressionToList(prefix));
}//setup


function draw() {
  background(200);
  fir.display();
}//draw

function keyPressed() {
  if (key == 'r') {
    fir = new ExpressionTree(400, 20, 5, false, RAND_TREE);
    print(fir.traverse(IN));
  }

  else if (key == 'i') {
    fir = new ExpressionTree(400, 20, MAX_DEPTH, infix, IN);
  }

  else if (key == 'p') {
    fir = new ExpressionTree(400, 20, MAX_DEPTH, prefix, PRE);
  }
  fir.evaluate();
}//keyPressed


function mousePressed() {
  var selected = fir.findNode(int(mouseX), int(mouseY));
  if (selected != null) {
    selected.flipNode();
    fir.evaluate();
    fir.display();
    //saveFrame("l04_exp-tree-nan.png");
  }
}//mousePressed


function tokenize(expression) {
  var tokens = new Array();
  var parens = "";
  while (expression.length > 0) {
    var c = expression.charAt(0);
    if (c == '(' || c == ')' ||
        c == '+' || c == '-' ||
        c == '*' || c == '/') {
      tokens.push(str(c));
      expression = expression.substring(1);
    }//operators & parens
    else if ( c >= '0' && c <= '9') {
      var i = 0;
      while (i < expression.length &&
             ((expression.charAt(i) >= '0' &&
             expression.charAt(i) <= '9') ||
             expression.charAt(i) == '.'))  {
        i++;
      }//find the end of the number
      var num = expression.substring(0, i);
      tokens.push(num);
      expression = expression.substring(i);
    }//numbers
    else {
      expression = expression.substring(1);
    }//ignore spaces
  }
  return tokens;
}//tokenize

class ExpressionTreeNode {

  constructor(token, x, y, t, v) {
    this.position = new p5.Vector(x, y);
    this.psize = PART_SIZE;
    this.left = null;
    this.right = null;
    this.c = color(240, 140, 40);
    if (token == false) {
      this.type = t;
      this.value = v;
    }
    else {
      this.type = 4;
      this.value = 0;
      var tokenValue = float(token);

      if (isNaN(tokenValue)) {
        this.type = this.nodeTypeFromString(token);
      }//operation node
      else {
        this.value = tokenValue;
      }//value Node
    }
  }//float constructor


  nodeTypeFromString(token) {
    var op = PLUS;
    if (token == "-") {
      op = MINUS;
    }
    else if (token == "*") {
      op = TIMES;
    }
    else if (token == "/") {
      op = DIVIDE;
    }
    return op;
  }//nodeTypeFromString

  getDisplayString() {
    var s = str(this.value);
    if (this.type != VAL) {
      if (this.type == PLUS) {
        s = "+";
      }
      else if (this.type == MINUS) {
        s = "-";
      }
      else if (this.type == TIMES) {
        s = "*";
      }
      else if (this.type == DIVIDE) {
        s = "/";
      }
    }
    return s;
  }//getDisplayString

  contains(x, y) {
    var d = this.position.dist(new p5.Vector(x, y));
    return d <= this.psize;
  }//contains

  flipNode() {
    if (this.type != VAL) {
      this.type = (this.type + 1) % 4;
    }
    else {
      if (this.value == 0) {
        this.value = int(random(100));
      }
      else {
        this.value = 0;
      }
    }
  }//filpNode

  display() {
    if (this.left != null) {
      stroke(40, 200, 190);
      line(this.position.x, this.position.y, this.left.position.x, this.left.position.y);
    }
    if (this.right != null) {
      stroke(210, 50, 150);
      line(this.position.x, this.position.y, this.right.position.x, this.right.position.y);
    }
    noStroke();
    fill(this.c);
    circle(this.position.x, this.position.y, this.psize);
    fill(0);
    textSize(15);
    textAlign(CENTER, TOP);
    text(this.value, this.position.x, this.position.y);
    if (this.type != VAL) {
      textAlign(CENTER, BASELINE);
      text(this.getDisplayString(), this.position.x, this.position.y);
    }
  }//display

}//node

class ExpressionTree {

  constructor(x, y, numLevels, expression, expType) {
    if (expType == RAND_TREE) {
      this.totalLevels = numLevels;
      this.root = this.makeTree(x, y, numLevels);
      this.populateTree(this.root);
    }
    else {
      this.totalLevels = MAX_DEPTH;
      var tokens = tokenize(expression);
      if (expType == PRE) {
        this.root = this.makeTreePrefix(x, y, tokens, this.totalLevels);
      }
      else {
        this.root = this.makeTreeInfix(x, y, tokens, this.totalLevels);
      }
    }
  }//constructor

  makeTree(x, y, numLevels) {
    if (numLevels == 0) {
      return null;
    }

    var newNode = new ExpressionTreeNode(false, x, y, 0, 0);

    var xoffset = width / (pow(2, this.totalLevels - numLevels+2));
    var leftX = int(x + xoffset * -1);
    var rightX = int(x + xoffset);
    var newY = y + Y_SPACE;

    if ( random(this.totalLevels) >= (this.totalLevels - numLevels)) {
      newNode.left = this.makeTree(leftX, newY, numLevels-1);
      newNode.right = this.makeTree(rightX, newY, numLevels-1);
    }
    return newNode;
  }//makeTree

  populateTree(current) {
    if (current.left == null && current.right == null) {
      current.type = VAL;
      current.value = int(random(100));
      //current.value = 0;
    }
    else {
      current.type = int(random(4));
      this.populateTree(current.left);
      this.populateTree(current.right);
    }
  }//populateTree

  makeTreePrefix(x, y, tokens, numLevels) {
    if ( tokens.length == 0 ) {
      return null;
    }//no more nodes!

    var token = tokens.shift();
    if (token == "(" || token == ")") {
      return this.makeTreePrefix(x, y, tokens, numLevels);
    }

    var newNode = new ExpressionTreeNode(token, x, y, 0, 0);

    if (newNode.type == VAL) {
      return newNode;
    }
    else {
      var xoffset = width / (pow(2, this.totalLevels - numLevels+2));
      var leftX = int(x + xoffset * -1);
      var rightX = int(x + xoffset);
      var newY = y + Y_SPACE;

      newNode.left = this.makeTreePrefix(leftX, newY, tokens, numLevels-1);
      newNode.right = this.makeTreePrefix(rightX, newY, tokens, numLevels-1);

      return newNode;
    }//operator, make a node
  }//convertToTree


  makeTreeInfix(x, y, tokens, numLevels) {
    if ( tokens.length == 0 ) {
      return null;
    }//no more nodes!
    var newNode = new ExpressionTreeNode(false, x, y, 0, 0);
    var xoffset = width / (pow(2, this.totalLevels - numLevels+2));
    var leftX = int(x + xoffset * -1);
    var rightX = int(x + xoffset);
    var newY = y + Y_SPACE;

    var token = tokens.shift();
    var tokenValue = float(token);

    if (token == "(") {
      newNode.left = this.makeTreeInfix(leftX, newY, tokens, numLevels-1);
      token = tokens.shift(); //operation
      newNode.type = newNode.nodeTypeFromString(token);
      newNode.right = this.makeTreeInfix(rightX, newY, tokens, numLevels-1);
      tokens.shift(); //closing parentheses
    }
    else {
      newNode.type = VAL;
      newNode.value = tokenValue;
    }//number
    return newNode;
  }

  displayHelper(current) {
    if (current != null) {
      current.display();
      this.displayHelper(current.left);
      this.displayHelper(current.right);
    }
  }//display
  display() {
    this.displayHelper(this.root);
  }//display wrapper

  traverse(type) {
    if (type == PRE)
      return this.preOrder(this.root);
    else if (type == POST)
      return this.postOrder(this.root);
    else if (type == IN)
      return this.inOrder(this.root);
    return "";
  }//traverse wrapper

  inOrder(current) {
    var s = "";
    if (current != null) {
      s = current.getDisplayString();
      if (current.type == VAL) {
        return s;
      }
      else {
        return "(" + this.inOrder(current.left) + " " + s + " " +  this.inOrder(current.right) + ")";
      }
    }
    return s;
  }//inOrder

  preOrder(current) {
    var s = "";
    if (current != null) {
      s = current.getDisplayString();
      if (current.type == VAL) {
        return s;
      }
      else {
        return "(" + s + " " + this.preOrder(current.left) + " " + this.preOrder(current.right) + ")";
      }
    }
    return "";
  }

  postOrder(current) {
    var s = "";
    if (current != null) {
      s = current.getDisplayString();
      if (current.type == VAL) {
        return s;
      }
      else {
        return "(" + this.postOrder(current.left) + " " + this.postOrder(current.right) + " " + s + ")";
      }
    }
    return s;
  }

  evaluateHelper(current) {
    if (current.type == VAL) {
      return current.value;
    }
    else {
      var leftValue = this.evaluateHelper(current.left);
      var rightValue = this.evaluateHelper(current.right);
      if (current.type == PLUS) {
        current.value = leftValue + rightValue;
      }
      else if (current.type == MINUS) {
        current.value = leftValue - rightValue;
      }
      else if (current.type == TIMES) {
        current.value = leftValue * rightValue;
      }
      else if (current.type == DIVIDE) {
        current.value = leftValue / rightValue;
      }
      if (!isFinite(current.value) || isNaN(current.value)) {
        current.c = color(255, 0, 0);
        return NaN;
      }
      else {
        current.c = DEFAULT_C;
      }
      return current.value;
    }
  }//evaluate
  evaluate() {
    this.evaluateHelper(this.root);
  }//evaluate wrapper

 findNodeHelper(current, x, y) {
   if (current == null) {
     return null;
   }
   else if (current.contains(x, y)) {
     return current;
   }
   else if (x > current.position.x) {
     return this.findNodeHelper(current.right, x, y);
   }
   else {
     return this.findNodeHelper(current.left, x, y);
   }
 }//findNode
 findNode(x, y) {
    return this.findNodeHelper(this.root, x, y);
 }//findNode wrapper



}//ExpressionTree
