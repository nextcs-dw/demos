class Land {

  int size;
  int state;
  int nextState;
  int x;
  int y;

  Land(int _x, int _y, int sz, int st) {
    x = _x;
    y = _y;
    size = sz;
    state = st;
  }

  void display() {
    noStroke();
    if (state == DIRT) {
      fill(#81582F);
    } else if (state == FIRE) {
      fill(#F20C0C);
    } else if (state == BURNT) {
      fill(#810707);
    } else if (state == TREE) {
      fill(#49B90D);
    }
    square(x, y, size);
  }

  void updateState(Land neighbor) {
    if (state == FIRE) {
      nextState = BURNT;
    } else if (state == TREE && neighbor.state == FIRE) {
      nextState = FIRE;
    } else {
      nextState = state;
    }
  }

  void updateState(boolean neighborFire) {
    if (state == FIRE) {
      nextState = BURNT;
    } else if (state == TREE && neighborFire) {
      nextState = FIRE;
    } else {
      nextState = state;
    }
  }


  void updateState (int up, int down, int left, int right) {
    if (state == FIRE) { 
      nextState = BURNT;
    } 
    else if (state == TREE) {
      if ( (up == FIRE) ||
        (down == FIRE) ||
        (left == FIRE) ||
        (right == FIRE)) {
        nextState = FIRE;
      } 
      else {
        nextState = TREE;
      }
    } 
    else {
      nextState = state;
    }
  }
  void changeState() {
    state = nextState;
  }
}
