ExpressionTree fir;
String prefix = "+ - * 80.0 66.0 36.0 * 58.0 - 36.0 51.0";
String prefix2 = "(+ (- (* 80.0 66.0) 36.0) (* 58.0 (- 36.0 51.0)))";
String infix = "((22.0 - (43.0 + (52.0 - 62.0))) + (4.0 * 72.0))";

void setup() {
  size(800, 400);
  background(200);

  //fir = new ExpressionTree(400, 20, 4);
  fir = new ExpressionTree(400, 20, infix, ExpressionTree.IN);
  //fir = new ExpressionTree(400, 20, prefix2, ExpressionTree.PRE);

  fir.display();
  fir.evaluate();

  println(fir.traverse(ExpressionTree.IN));
  println(fir.traverse(ExpressionTree.PRE));
  println(fir.traverse(ExpressionTree.POST));


  println(expressionToList(infix));
  println(expressionToList(prefix));
}//setup

void draw() {
  background(200);
  fir.display();
}//draw

void keyPressed() {
  if (key == 'r') {
    fir = new ExpressionTree(400, 20, 5);
    println(fir.traverse(ExpressionTree.IN));
  }
  else if (key == 'i') {
    fir = new ExpressionTree(400, 20, infix, ExpressionTree.IN);
  }
  else if (key == 'p') {
    fir = new ExpressionTree(400, 20, prefix, ExpressionTree.PRE);
  }
  fir.evaluate();
}//keyPressed


void mousePressed() {
  ExpressionTreeNode selected = fir.findNode(int(mouseX), int(mouseY));
  if (selected != null) {
    selected.flipNode();
    fir.evaluate();
    fir.display();
    //saveFrame("l04_exp-tree-nan.png");
  }
}//mousePressed

StringList expressionToList(String expression) {
  String[] ts = expression.split(" ");
  StringList tokens = new StringList();
  String parens = "";

  for (int i=0; i < ts.length; i++) {
    while ( ts[i].charAt(0) == '(' ) {
      tokens.append(ts[i].charAt(0)+"");
      ts[i] = ts[i].substring(1);
    }//deal with (

    while ( ts[i].charAt(ts[i].length()-1) == ')') {
      parens+= ")";
      ts[i] = ts[i].substring(0, ts[i].length()-1);
    }//remove & store all )

    tokens.append(ts[i]);

    while (parens.length() != 0) {
      tokens.append(parens.charAt(0) + "");
      parens = parens.substring(1);
    }//add back the )
  }
  return tokens;
}//expressionToList
