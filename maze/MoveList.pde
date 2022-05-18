class MoveList {
  
  Move[] moves;
  int last;
  
  MoveList() {
    last = 0;
    moves = new Move[10];
  }//constructor

  void expand() {
    Move[] newList = new Move[moves.length * 2];
    for (int m=0; m<moves.length; m++) {
      newList[m] = moves[m];
    }//copy values
    moves = newList;
  }//expand
  
  void add(Move m) {
    if (last == moves.length) {
      expand();
    }//expand
    moves[last] = m; 
    last++;
  }//add
  
  Move remove() {
    Move v = moves[0];
    for (int m=0; m < last-1; m++) {
      moves[m] = moves[m+1];
    }//slide values down
    last--;
    return v;
  }//remove
  
  int length() {
    return last;
  }
  
  String toString() {
    String s = "[ ";
    for (int m=0; m<last; m++) {
      s+= moves[m] + " ";
    }
    s+= "]";
    return s;
  }//toString
}
