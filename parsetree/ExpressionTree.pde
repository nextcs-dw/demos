class ExpressionTree {

  static final int Y_SPACE = 75;
  static final int PRE = 0;
  static final int POST = 1;
  static final int IN = 2;
  static final int MAX_DEPTH = 5;

  ExpressionTreeNode root;
  int totalLevels;

  ExpressionTree(int x, int y, int numLevels) {
    totalLevels = numLevels;
    root = makeTree(x, y, numLevels);
    populateTree(root);
  }
  ExpressionTreeNode makeTree(int x, int y, int numLevels) {
    if (numLevels == 0) {
      return null;
    }

    ExpressionTreeNode newNode = new ExpressionTreeNode(x, y, 0, 0);

    float xoffset = width / (pow(2, totalLevels - numLevels+2));
    int leftX = int(x + xoffset * -1);
    int rightX = int(x + xoffset);
    int newY = y + Y_SPACE;

    if ( random(totalLevels) >= (totalLevels - numLevels)) {
      newNode.left = makeTree(leftX, newY, numLevels-1);
      newNode.right = makeTree(rightX, newY, numLevels-1);
    }
    return newNode;
  }//makeTree

  void populateTree(ExpressionTreeNode current) {
    if (current.left == null && current.right == null) {
      current.type = ExpressionTreeNode.VAL;
      current.value = int(random(100));
      //current.value = 0;
    }
    else {
      current.type = int(random(4));
      populateTree(current.left);
      populateTree(current.right);
    }
  }//populateTree

  ExpressionTree(int x, int y, String expression, int expType) {
    totalLevels = MAX_DEPTH;
    StringList tokens = expressionToList(expression);
    if (expType == PRE) {
      root = makeTreePrefix(x, y, tokens, totalLevels);
    }
    else {
      root = makeTreeInfix(x, y, tokens, totalLevels);
    }
  }//
  ExpressionTreeNode makeTreePrefix(int x, int y, StringList tokens, int numLevels) {
    if ( tokens.size() == 0 ) {
      return null;
    }//no more nodes!

    String token = tokens.remove(0);
    if (token.equals("(") || token.equals(")")) {
      return makeTreePrefix(x, y, tokens, numLevels);
    }

    ExpressionTreeNode newNode = new ExpressionTreeNode(x, y, token);

    if (newNode.type == ExpressionTreeNode.VAL) {
      return newNode;
    }
    else {
      float xoffset = width / (pow(2, totalLevels - numLevels+2));
      int leftX = int(x + xoffset * -1);
      int rightX = int(x + xoffset);
      int newY = y + Y_SPACE;

      newNode.left = makeTreePrefix(leftX, newY, tokens, numLevels-1);
      newNode.right = makeTreePrefix(rightX, newY, tokens, numLevels-1);

      return newNode;
    }//operator, make a node
  }//convertToTree


  ExpressionTreeNode makeTreeInfix(int x, int y, StringList tokens, int numLevels) {
    if ( tokens.size() == 0 ) {
      return null;
    }//no more nodes!

    ExpressionTreeNode newNode = new ExpressionTreeNode(x, y, 0, 0);
    float xoffset = width / (pow(2, totalLevels - numLevels+2));
    int leftX = int(x + xoffset * -1);
    int rightX = int(x + xoffset);
    int newY = y + Y_SPACE;

    String token = tokens.remove(0);
    float tokenValue = float(token);

    if (token.equals("(")) {
      newNode.left = makeTreeInfix(leftX, newY, tokens, numLevels-1);
      token = tokens.remove(0); //operation
      newNode.type = newNode.nodeTypeFromString(token);
      newNode.right = makeTreeInfix(rightX, newY, tokens, numLevels-1);
      tokens.remove(0); //closing parentheses
    }
    else {
      newNode.type = ExpressionTreeNode.VAL;
      newNode.value = tokenValue;
    }//number
    return newNode;
  }

  void display(ExpressionTreeNode current) {
    if (current != null) {
      current.display();
      display(current.left);
      display(current.right);
    }
  }//display
  void display() {
    display(root);
  }//display wrapper

  String traverse(int type) {
    if (type == PRE)
      return preOrder(root);
    else if (type == POST)
      return postOrder(root);
    else if (type == IN)
      return inOrder(root);
    return "";
  }//traverse wrapper

  String inOrder(ExpressionTreeNode current) {
    String s = "";
    if (current != null) {
      s = current.getDisplayString();
      if (current.type == ExpressionTreeNode.VAL) {
        return s;
      }
      else {
        return "(" + inOrder(current.left) + " " + s + " " +  inOrder(current.right) + ")";
      }
    }
    return s;
  }//inOrder

  String preOrder(ExpressionTreeNode current) {
    String s = "";
    if (current != null) {
      s = current.getDisplayString();
      if (current.type == ExpressionTreeNode.VAL) {
        return s;
      }
      else {
        return "(" + s + " " + preOrder(current.left) + " " + preOrder(current.right) + ")";
      }
    }
    return "";
  }

  String postOrder(ExpressionTreeNode current) {
    String s = "";
    if (current != null) {
      s = current.getDisplayString();
      if (current.type == ExpressionTreeNode.VAL) {
        return s;
      }
      else {
        return "(" + postOrder(current.left) + " " + postOrder(current.right) + " " + s + ")";
      }
    }
    return s;
  }

  float evaluate(ExpressionTreeNode current) {
    if (current.type == ExpressionTreeNode.VAL) {
      return current.value;
    }
    else {
      float leftValue = evaluate(current.left);
      float rightValue = evaluate(current.right);
      if (current.type == ExpressionTreeNode.PLUS) {
        current.value = leftValue + rightValue;
      }
      else if (current.type == ExpressionTreeNode.MINUS) {
        current.value = leftValue - rightValue;
      }
      else if (current.type == ExpressionTreeNode.TIMES) {
        current.value = leftValue * rightValue;
      }
      else if (current.type == ExpressionTreeNode.DIVIDE) {
        current.value = leftValue / rightValue;
      }
      if (Float.isInfinite(current.value) || Float.isNaN(current.value)) {
        current.c = color(255, 0, 0);
        return Float.NaN;
      }
      else {
        current.c = ExpressionTreeNode.DEFAULT_C;
      }
      return current.value;
    }
  }//evaluate
  void evaluate() {
    evaluate(root);
  }//evaluate wrapper

 ExpressionTreeNode findNode(ExpressionTreeNode current, int x, int y) {
   if (current == null) {
     return null;
   }
   else if (current.contains(x, y)) {
     return current;
   }
   else if (x > current.position.x) {
     return findNode(current.right, x, y);
   }
   else {
     return findNode(current.left, x, y);
   }
 }//findNode
 ExpressionTreeNode findNode(int x, int y) {
    return findNode(root, x, y);
 }//findNode wrapper




}//ExpressionTree
