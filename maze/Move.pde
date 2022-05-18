class Move {

  int row;
  int col;
  int type;

  Move(int r, int c, int t) {
    row = r;
    col = c;
    type = t;
  }

  String toString() {
    return "(" + row + " " + col + ")";
  }
}
