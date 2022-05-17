String PICFILE = "boats.jpg";

int factor = 100;
float THRESHHOLD = 10;
float averageDiff = 0;
PImage art;
PImage artbackup;
PImage debugart;
int[][] dmap;
boolean showSeam = true;
boolean fullSizePic = true;

void setup() {
 size(519, 360); //boats
 //size(700, 466);
 art = loadImage(PICFILE);
 art.loadPixels();
 artbackup = loadImage(PICFILE);
 artbackup.loadPixels();
 debugart = loadImage(PICFILE);
 debugart.loadPixels();
 dmap = new int[art.height][art.width];
}

void draw() {
  background(0);
  if (fullSizePic) {
    image(art, 0, 0);
  }
  else {
    image(scaleSmallImg(art, factor), 0, 0);
    for (int dr=0; dr<art.height; dr++) {
      for(int dc=0; dc<art.width; dc++) {
        int px = dr*art.width + dc;
        fill(0);
        text(int(red(debugart.pixels[px])), dc * factor, (dr * factor)+10);
        text(int(green(debugart.pixels[px])), dc * factor + 30, (dr * factor)+10);
        text(int(blue(debugart.pixels[px])), dc * factor + 60, (dr * factor)+10);
        text(dmap[dr][dc], dc * factor, (dr * factor)+20);
      }
    }
  }
}

void keyPressed() {
  if (key == 'e') {
    art = edgeDetect(art);
    art.updatePixels();
  }
  if (key == 'c') {
    if (showSeam) {
      artbackup = art.copy();
      debugart = artbackup;
    }
    else {
      art = artbackup.copy();
    }
    art = seamCarve(art, showSeam);
    if (!showSeam) {
      debugart = art;
    }
    art.updatePixels();
    showSeam = !showSeam;
  }
  if (key == 'm') {
    art = multiCarve(art, 100);
  }
  if (key == 'i') {
    art = seamInsertion(art, 100);
  }
  if (key == 'g') {
    art = grayScale(art);
    art.updatePixels();
  }
  if (key == 'r') {
    art = loadImage(PICFILE);
  }
}

PImage scaleSmallImg(PImage img, int factor) {
  PImage tmp = new PImage(img.width*factor, img.height*factor);
  tmp.loadPixels();
  for (int row=0; row < tmp.height; row++) {
    for (int col=0; col< tmp.width; col++) {
      int tpx = (row * tmp.width) + col;
      int prow = row / factor;
      int pcol = col / factor;
      int px = (prow * img.width) + pcol;
      tmp.pixels[tpx] = img.pixels[px];
    }
  }
  tmp.updatePixels();
  return tmp;
}

PImage seamInsertion(PImage img, int numSeams) {
  PImage tmp = new PImage(img.width, img.height);
  tmp.loadPixels();
  ArrayList<int []> seams;
  //get a list of all the seams to be removed
  seams = getSeams(img, numSeams);
  //add seams
  for (int s=0; s < seams.size(); s++) {
    int[] seam = seams.get(s);
    tmp = addSeam(img, seam);
    img = tmp;
  }
  return tmp;
}//seamInsertion

ArrayList<int[]> getSeams(PImage img, int numSeams) {
  PImage tmp = new PImage(img.width, img.height);
  PImage tmp2 = loadImage(PICFILE);
  tmp2.loadPixels();
  int[][] diffMap;
  int[][] vertDmap;
  ArrayList<int []> seams = new ArrayList<int []>();
  //get a list of all the seams to be removed
  for (int s=0; s < numSeams; s++) {
    tmp = new PImage(tmp2.width, tmp2.height);
    tmp.loadPixels();
    diffMap = getDiffMap(tmp2, tmp, false);
    //generate the cumulative gradients
    vertDmap = getVertDmap(diffMap);
    seams.add(getVertSeam(vertDmap));
    tmp = removeSeam(tmp2, seams.get(seams.size()-1));
    tmp2 = tmp;
  }
  return seams;
}

PImage addSeam(PImage img, int[] seam) {
  PImage tmp = new PImage(img.width+1, img.height);
  tmp.loadPixels();
  for (int row=0; row < seam.length; row++) {
    int colOffset = 0;
    for (int col=0; col < img.width; col++) {
      int tpx = (row * tmp.width) + col + colOffset;
      int px = (row * img.width) + col;
      if (col == seam[row]) {
        colOffset = 1;
        tmp.pixels[tpx] = img.pixels[px];
        tmp.pixels[tpx+1] = getNewColor(img, row, col);
      }
      else {
        tmp.pixels[tpx] = img.pixels[px];
      }
    }
  }
  return tmp;
}//addSeam

color getNewColor(PImage img, int r, int c) {
  float[] newColor = new float[3];
  int[] neighbors = {c-1, c+1};
  if (c == 0) {
    neighbors[0] = img.width-1;
  }
  if (c == img.width-1) {
    neighbors[1] = 0;
  }
  neighbors[0] = (r * img.width) + neighbors[0];
  neighbors[1] = (r * img.width) + neighbors[1];
  newColor[0] = (red(img.pixels[neighbors[0]]) + red(img.pixels[neighbors[1]]))/2;
  newColor[1] = (green(img.pixels[neighbors[0]]) + green(img.pixels[neighbors[1]]))/2;
  newColor[2] = (blue(img.pixels[neighbors[0]]) + blue(img.pixels[neighbors[1]]))/2;

  return color(newColor[0], newColor[1], newColor[2]);
}//getNewColor


PImage multiCarve(PImage img, int numSeams) {
  PImage tmp = new PImage(img.width, img.height);
  ArrayList<int[]> seams = getSeams(img, numSeams);
  for (int s=0; s < seams.size(); s++) {
    int[] seam = seams.get(s);
    tmp = removeSeam(img, seam);
    img = tmp;
  }
  return tmp;
}

/*
PImage multiCarve(PImage img, int numSeams) {
  PImage tmp = new PImage(img.width, img.height);
  int[][] diffMap;
  int[][] vertDmap;
  //ArrayList<int []> seams = new ArrayList<int []>();
  //calculate the gradients
  for (int s=0; s < numSeams; s++) {
    tmp = new PImage(img.width, img.height);
    tmp.loadPixels();
    diffMap = getDiffMap(img, tmp, false);
    //generate the cumulative gradients
    vertDmap = getVertDmap(diffMap);
    int[] seam = getVertSeam(vertDmap);
    tmp = removeSeam(img, seam);
    img = tmp;
  }
  return tmp;
}//multiCarve
*/


PImage seamCarve(PImage img, boolean showSeam) {
  PImage tmp = new PImage(img.width, img.height);
  tmp.loadPixels();
  int[][] diffMap;
  int[][] vertDmap;
  //calculate the gradients
  diffMap = getDiffMap(img, tmp, showSeam);
  //generate the cumulative gradients
  vertDmap = getVertDmap(diffMap);
  int[] seam = getVertSeam(vertDmap);
  if (showSeam) {
    for (int r=0; r < seam.length; r++) {
      int px = (r * img.width) + seam[r];
      tmp.pixels[px] = color(255, 0, 0);
    }
  }
  else {
    tmp = removeSeam(img, seam);
  }
  dmap = vertDmap;
  return tmp;
}//seamCarve

int[][] getDiffMap(PImage img, PImage tmp, boolean showSeam) {
  int[][] diffMap = new int[img.height][img.width];
  for (int row=0; row < img.height; row++) {
    for (int col=0; col< img.width; col++) {
      int px = (row * img.width) + col;
      //calcualte color differnce: sum of abs of differences for r, g, b
      //populate grid of differences
      diffMap[row][col] = getNeighborGradient1(img, row, col);
      if (showSeam) {
        //use 1530 for getNeighborGradient0
        //use 3060 for getNeighborGradient1
        //use 624.7 for getNeighborGradient2
        tmp.pixels[px] = color(map(diffMap[row][col], 0, 3060, 0, 255));
      }
    }
  }
  return diffMap;
}

/*
  Create the cumulative gradient map.
  for row 0, a cell's gradient is its value in diffMap

  for all other rows, a cell's gradient is it's diffMap
  value + the smallest neighbor one row above.
*/
int[][] getVertDmap(int[][] diffMap) {
  int[][] vertDmap = new int[diffMap.length][diffMap[0].length];

  for (int row=0; row<vertDmap.length; row++) {
    for (int col=0; col<vertDmap[row].length; col++) {
      vertDmap[row][col] = diffMap[row][col];
      int[] values = {Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE};
      if (row != 0) {
        if (col != 0 ) {
          values[0] = vertDmap[row-1][col-1];
        }
        if (col != vertDmap[row].length-1) {
          values[2] = vertDmap[row-1][col+1];
        }
        values[1] = vertDmap[row-1][col];
        vertDmap[row][col]+= min(values);
      }
    }
  }
  return vertDmap;
}


int[] getVertSeam(int[][] vertDmap) {
  int minVal = Integer.MAX_VALUE;
  int minCol = -1;
  int nextMinCol = -1;
  int[] seam = new int[vertDmap.length];
  //find smallest col in last row
  for (int col=0; col < vertDmap[vertDmap.length-1].length; col++) {
      if ( vertDmap[vertDmap.length-1][col] < minVal) {
        minVal = vertDmap[vertDmap.length-1][col];
        minCol = col;
      }
  }//smallest last col
  seam[seam.length-1] = minCol;

  //now that we know which col to start with,
  //work our way back up, checking at most 3 cels per row
  for (int row=vertDmap.length-2; row >= 0; row--) {
    minVal = Integer.MAX_VALUE;
    for(int col=minCol-1; col < minCol+2; col++) {
      if (col != -1 && col != vertDmap[row].length) {
        if (vertDmap[row][col] < minVal) {
          minVal = vertDmap[row][col];
          nextMinCol = col;
        }
      }
    }
    minCol = nextMinCol;
    seam[row] = minCol;
  }//create seam
  return seam;
}

PImage removeSeam(PImage img, int[] seam) {
  PImage tmp = new PImage(img.width-1, img.height);
  tmp.loadPixels();
  for (int row=0; row < img.height; row++) {
    int colOffset = 0;
    for (int col=0; col< img.width; col++) {
      if (col == seam[row]) {
        colOffset = -1;
        col++;
      }
      if (col < img.width) {
        int ipx = (row * img.width) + col;
        int tpx = (row * tmp.width) + col+colOffset;
        tmp.pixels[tpx] = img.pixels[ipx];
      }
    }
  }
  return tmp;
}

float getNeighborGradient2(PImage img, int r, int c) {
  float[] xgradient = new float[3];
  float[] ygradient = new float[3];
  float[] xygradient = new float[3];
  float gradient = 0;
  color neighborPixel;
  color pixel = img.pixels[(r*img.width) + c];
  if (r != 0) {
    neighborPixel = img.pixels[((r-1) * img.width) + c];
  }
  else {
    neighborPixel = img.pixels[((img.height-1) * img.width) + c];
  }
  ygradient[0] = red(neighborPixel);
  ygradient[1] = green(neighborPixel);
  ygradient[2] = blue(neighborPixel);
  if (r != img.height-1) {
    neighborPixel = img.pixels[((r+1) * img.width) + c];
  }
  else {
    neighborPixel = img.pixels[c];
  }
  ygradient[0] = pow(ygradient[0] - red(neighborPixel), 2);
  ygradient[1] = pow(ygradient[1] - green(neighborPixel), 2);
  ygradient[2] = pow(ygradient[2] - blue(neighborPixel), 2);
  if ( c != 0 ){
    neighborPixel = img.pixels[(r * img.width) + (c-1)];
  }
  else {
    neighborPixel = img.pixels[(r * img.width) + (img.width-1)];
  }
  xgradient[0] = red(neighborPixel);
  xgradient[1] = green(neighborPixel);
  xgradient[2] = blue(neighborPixel);
  if (c != img.width-1) {
    neighborPixel = img.pixels[(r * img.width) + (c + 1)];
  }
  else {
    neighborPixel = img.pixels[(r * img.width)];
  }
  xgradient[0] = pow(xgradient[0] - red(neighborPixel), 2);
  xgradient[1] = pow(xgradient[1] - green(neighborPixel), 2);
  xgradient[2] = pow(xgradient[2] - blue(neighborPixel), 2);
  for(int i=0; i<3;i++) {
    gradient+= ygradient[i] + xgradient[i];
  }
  return sqrt(gradient);
}


int getNeighborGradient1(PImage img, int r, int c) {
  float[] xgradient = new float[3];
  float[] ygradient = new float[3];
  float gradient = 0;
  color neighborPixel;
  color pixel = img.pixels[(r*img.width) + c];
  if (r != 0) {
    neighborPixel = img.pixels[((r-1) * img.width) + c];
  }
  else {
    neighborPixel = img.pixels[((img.height-1) * img.width) + c];
  }
  ygradient[0] = abs(red(pixel) - red(neighborPixel));
  ygradient[1] = abs(green(pixel) - green(neighborPixel));
  ygradient[2] = abs(blue(pixel) - blue(neighborPixel));
  if (r != img.height-1) {
    neighborPixel = img.pixels[((r+1) * img.width) + c];
  }
  else {
    neighborPixel = img.pixels[c];
  }
  ygradient[0]+= abs(red(pixel) - red(neighborPixel));
  ygradient[1]+= abs(green(pixel) - green(neighborPixel));
  ygradient[2]+= abs(blue(pixel) - blue(neighborPixel));
  if ( c != 0 ){
    neighborPixel = img.pixels[(r * img.width) + (c-1)];
  }
  else {
    neighborPixel = img.pixels[(r * img.width) + (img.width-1)];
  }
  xgradient[0] = abs(red(pixel) - red(neighborPixel));
  xgradient[1] = abs(green(pixel) - green(neighborPixel));
  xgradient[2] = abs(blue(pixel) - blue(neighborPixel));
  if (c != img.width-1) {
    neighborPixel = img.pixels[(r * img.width) + (c + 1)];
  }
  else {
    neighborPixel = img.pixels[(r * img.width)];
  }
  xgradient[0]+= abs(red(pixel) - red(neighborPixel));
  xgradient[1]+= abs(green(pixel) - green(neighborPixel));
  xgradient[2]+= abs(blue(pixel) - blue(neighborPixel));
  for(int i=0; i<3;i++) {
    gradient+= ygradient[i] + xgradient[i];
  }

  return int(gradient);
}

int getNeighborGradient0(PImage img, int r, int c) {
  float[] xgradient = new float[3];
  float[] ygradient = new float[3];
  float[] xygradient = new float[3];
  float gradient = 0;
  color neighborPixel;
  color pixel = img.pixels[(r*img.width) + c];
  if (r != 0) {
    neighborPixel = img.pixels[((r-1) * img.width) + c];
  }
  else {
    neighborPixel = img.pixels[((img.height-1) * img.width) + c];
  }
  ygradient[0] = red(neighborPixel);
  ygradient[1] = green(neighborPixel);
  ygradient[2] = blue(neighborPixel);
  if (r != img.height-1) {
    neighborPixel = img.pixels[((r+1) * img.width) + c];
  }
  else {
    neighborPixel = img.pixels[c];
  }
  ygradient[0] = abs(ygradient[0] - red(neighborPixel));
  ygradient[1] = abs(ygradient[1] - green(neighborPixel));
  ygradient[2] = abs(ygradient[2] - blue(neighborPixel));
  if ( c != 0 ){
    neighborPixel = img.pixels[(r * img.width) + (c-1)];
  }
  else {
    neighborPixel = img.pixels[(r * img.width) + (img.width-1)];
  }
  xgradient[0] = red(neighborPixel);
  xgradient[1] = green(neighborPixel);
  xgradient[2] = blue(neighborPixel);
  if (c != img.width-1) {
    neighborPixel = img.pixels[(r * img.width) + (c + 1)];
  }
  else {
    neighborPixel = img.pixels[(r * img.width)];
  }
  xgradient[0] = abs(xgradient[0] - red(neighborPixel));
  xgradient[1] = abs(xgradient[1] - green(neighborPixel));
  xgradient[2] = abs(xgradient[2] - blue(neighborPixel));
  for(int i=0; i<3;i++) {
    gradient+= ygradient[i] + xgradient[i];
  }
  return int(gradient);
}

int getTotalDifference(IntList neighbors, color pc) {
  int diff = 0;
  for (int n=0; n < neighbors.size(); n++) {
    color tmp = neighbors.get(n);
    diff+= abs(red(pc) - red(tmp));
    diff+= abs(green(pc) - green(tmp));
    diff+= abs(blue(pc) - blue(tmp));
  }
  return diff;
}//getTotalDifference

PImage grayScale(PImage img) {
  PImage tmp = new PImage(art.width, art.height);
  tmp.loadPixels();
  float gray = 0;
  for (int row=0; row < art.height; row++) {
    for (int col=0; col< art.width; col++) {
      int px = (row * art.width) + col;
      color pc = art.pixels[px];
      gray = (red(pc) + green(pc) + blue(pc))/3;
      //tmp.pixels[px] = color(gray, gray, gray);
      tmp.pixels[px] = color(gray);
    }
  }
  return tmp;
}

PImage edgeDetect(PImage img) {
  PImage tmp = new PImage(img.width, img.height);
  tmp.loadPixels();
  img = grayScale(img);
  averageDiff = 0;
  for (int row=0; row < img.height; row++) {
    for (int col=0; col< img.width; col++) {
      int px = (row * img.width) + col;
      color pc = img.pixels[px];
      IntList neighborColors = getNeighborColors(img, row, col);
      float difference = getDifference(neighborColors, pc);
      averageDiff+= difference;
      if (difference < THRESHHOLD) {
        tmp.pixels[px] = color(255);
        //println("not edge");
      }
      else {
        tmp.pixels[px] = color(0);
        //println("edge");
      }
    }
  }
  averageDiff = averageDiff/(tmp.width * tmp.height);
  println(averageDiff);
  return tmp;
}

IntList getNeighborColors(PImage img, int r, int c) {
  IntList neighborColors = new IntList();
  int neighborPixel;
  if (r != 0) {
    neighborPixel = ((r-1) * img.width) + c;
    neighborColors.append(img.pixels[neighborPixel]);
  }
  if (r != img.height-1) {
    neighborPixel = ((r+1) * img.width) + c;
    neighborColors.append(img.pixels[neighborPixel]);
  }
  if ( c != 0 ){
    neighborPixel = (r * img.width) + (c-1);
    neighborColors.append(img.pixels[neighborPixel]);
  }
  if (c != img.width-1) {
    neighborPixel = (r * img.width) + (c + 1);
    neighborColors.append(img.pixels[neighborPixel]);
  }
  return neighborColors;
}

float getDifference(IntList neighborColors, color pc) {
  float diff = 0;

  for (int n=0; n < neighborColors.size(); n++) {
      diff+= abs(brightness(neighborColors.get(n)) - brightness(pc));
  }
  return diff/neighborColors.size();
}
