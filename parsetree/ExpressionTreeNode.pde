class ExpressionTreeNode {

  static final int PART_SIZE = 40;
  static final color DEFAULT_C = 0xFFF08C28;

  static final int PLUS = 0;
  static final int MINUS = 1;
  static final int TIMES = 2;
  static final int DIVIDE = 3;
  static final int VAL = 4;



  PVector position;
  int psize;
  color c;

  float value;
  int type;

  ExpressionTreeNode left;
  ExpressionTreeNode right;

  ExpressionTreeNode(int x, int y, int t, float v) {
    position = new PVector(x, y);
    psize = PART_SIZE;
    left = null;
    right = null;
    c = color(240, 140, 40);
    type = t;
    value = v;
  }//float constructor

  ExpressionTreeNode(int x, int y, String token) {
    this(x, y, 4, 0);
    float tokenValue = float(token);

    if (Float.isNaN(tokenValue)) {
      type = nodeTypeFromString(token);
    }//operation node
    else {
      value = tokenValue;
    }//value Node
  }//String constructor

  int nodeTypeFromString(String token) {
    int op = ExpressionTreeNode.PLUS;
    if (token.equals("-")) {
      op = ExpressionTreeNode.MINUS;
    }
    else if (token.equals("*")) {
      op = ExpressionTreeNode.TIMES;
    }
    else if (token.equals("/")) {
      op = ExpressionTreeNode.DIVIDE;
    }
    return op;
  }//nodeTypeFromString

  String getDisplayString() {
    String s = str(value);
    if (type != VAL) {
      if (type == PLUS) {
        s = "+";
      }
      else if (type == MINUS) {
        s = "-";
      }
      else if (type == TIMES) {
        s = "*";
      }
      else if (type == DIVIDE) {
        s = "/";
      }
    }
    return s;
  }//getDisplayString

  boolean contains(int x, int y) {
    float d = position.dist(new PVector(x, y));
    return d <= psize;
  }//contains

  void flipNode() {
    if (type != VAL) {
      type = (type + 1) % 4;
    }
    else {
      if (value == 0) {
        value = int(random(100));
      }
      else {
        value = 0;
      }
    }
  }//filpNode

  void display() {
    if (left != null) {
      stroke(40, 200, 190);
      line(position.x, position.y, left.position.x, left.position.y);
    }
    if (right != null) {
      stroke(210, 50, 150);
      line(position.x, position.y, right.position.x, right.position.y);
    }
    noStroke();
    fill(c);
    circle(position.x, position.y, psize);
    fill(0);
    textSize(15);
    textAlign(CENTER, TOP);
    text(value, position.x, position.y);
    if (type != VAL) {
      textAlign(CENTER, BASELINE);
      text(getDisplayString(), position.x, position.y);
    }
  }//display

}//Orb
