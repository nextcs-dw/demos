var PICFILE = "data/boats.jpg";

var factor = 100;
var THRESHHOLD = 10;
var averageDiff = 0;
var art;
var artbackup;
var debugart;
var dmap; //2d array!
var showSeam = true;
var fullSizePic = true;
var carveWidth = 519;

function preload() {
  art = loadImage(PICFILE);
  artbackup = loadImage(PICFILE);
  debugart = loadImage(PICFILE);
}

function setup() {
 createCanvas(519, 360); //boats
 pixelDensity(1);
 //createCanvas(700, 466);
 art.loadPixels();
 artbackup.loadPixels();
 debugart.loadPixels();
 dmap = new Array(art.height);
 for (var i=0; i < art.height; i++) {
   dmap[i] = new Array(art.width);
 }
}

function draw() {
  background(0);
  if (fullSizePic) {
    image(art, 0, 0);
  }
  else {
    image(scaleSmallImg(art, factor), 0, 0);
    for (var dr=0; dr<art.height; dr++) {
      for(var dc=0; dc<art.width; dc++) {
        var px = dr*art.width + dc;
        fill(0);
        text(int(red(debugart.pixels[px])), dc * factor, (dr * factor)+10);
        text(int(green(debugart.pixels[px])), dc * factor + 30, (dr * factor)+10);
        text(int(blue(debugart.pixels[px])), dc * factor + 60, (dr * factor)+10);
        text(dmap[dr][dc], dc * factor, (dr * factor)+20);
      }
    }
  }
}

function keyPressed() {

  if (key == 'e') {
    art = edgeDetect(art);
    art.updatePixels();
  }

  if (key == 'c') {
    if (showSeam) {
      artbackup.copy(art, 0, 0, art.width, art.height, 0, 0, artbackup.width, artbackup.height);
      debugart = artbackup;
    }
    else {
      art.copy(artbackup, 0, 0, artbackup.width, artbackup.height, 0, 0, art.width, art.height);
    }
    art = seamCarve(art, showSeam);
    if (!showSeam) {
      debugart.copy(art, 0, 0, art.width, art.height, 0, 0, debugart.width, debugart.height);
    }
    art.updatePixels();
    showSeam = !showSeam;
  }
  /*
  if (key == 'm') {
    art = multiCarve(art, 100);
  }
  if (key == 'i') {
    art = seamInsertion(art, 100);
  }
  */
  if (key == 'g') {
    art = grayScale(art);
    art.updatePixels();
  }
  if (key == 'r') {
    art = loadImage(PICFILE, art);//might need to change
  }
}


function scaleSmallImg(img, factor) {
  tmp = new p5.Image(img.width*factor, img.height*factor);
  tmp.loadPixels();
  for (var row=0; row < tmp.height; row++) {
    for (var col=0; col< tmp.width; col++) {
      var tpx = (row * tmp.width) + col;
      var prow = row / factor;
      var pcol = col / factor;
      var px = (prow * img.width) + pcol;
      tmp.pixels[tpx] = img.pixels[px];
    }
  }
  tmp.updatePixels();
  return tmp;
}

/*
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
*/


function seamCarve(img, showSeam) {
  var tmp = new p5.Image(img.width, img.height);
  tmp.copy(img, 0, 0, img.width, img.height, 0, 0, tmp.width, tmp.height);
  tmp.loadPixels();
  var diffMap;
  var vertDmap;
  //calculate the gradients
  diffMap = getDiffMap(img, tmp, showSeam);
  //generate the cumulative gradients
  vertDmap = getVertDmap(diffMap);
  var seam = getVertSeam(vertDmap);
  if (showSeam) {
    for (var r=0; r < seam.length; r++) {
      //print(seam[r]);
      var px = (r * img.width)*4 + seam[r]*4;
      //tmp.pixels[px] = color(255, 0, 0);
      img.pixels[px] = 255;
      img.pixels[px+1] = 0;
      img.pixels[px+2] = 0;
    }
  }
  else {
    img = removeSeam(img, seam);
  }
  dmap = vertDmap;
  img.updatePixels();
  return img;
}//seamCarve


function getDiffMap(img, tmp, showSeam) {
  var diffMap = new Array(img.height);//new int[img.height][img.width];
  for (var row=0; row < img.height; row++) {
    diffMap[row] = new Array(carveWidth);
    for (var col=0; col< carveWidth; col++) {
      var px = (row * img.width)*4 + col*4;
      //calcualte color differnce: sum of abs of differences for r, g, b
      //populate grid of differences
      diffMap[row][col] = getNeighborGradient1(tmp, row, col);
      if (showSeam) {
        //use 1530 for getNeighborGradient0
        //use 3060 for getNeighborGradient1
        //use 624.7 for getNeighborGradient2
        var diffColor = color(map(diffMap[row][col], 0, 3060, 0, 255));
        img.pixels[px] = red(diffColor);
        img.pixels[px+1] = green(diffColor);
        img.pixels[px+2] = blue(diffColor);
      }
    }
  }
  img.updatePixels();
  return diffMap;
}

function getVertDmap(diffMap) {
  var vertDmap = new Array(diffMap.length);

  for (var row=0; row<vertDmap.length; row++) {
    vertDmap[row] = new Array(diffMap[0].length);
    for (var col=0; col<vertDmap[row].length; col++) {
      vertDmap[row][col] = diffMap[row][col];
      var values = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
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


function getVertSeam(vertDmap) {
  var minVal = Number.MAX_SAFE_INTEGER;
  var minCol = -1;
  var nextMinCol = -1;
  var seam = new Array(vertDmap.length);
  //find smallest col in last row
  for (var col=0; col < vertDmap[vertDmap.length-1].length; col++) {
      if ( vertDmap[vertDmap.length-1][col] < minVal) {
        minVal = vertDmap[vertDmap.length-1][col];
        minCol = col;
      }
  }//smallest last col
  seam[seam.length-1] = minCol;

  //now that we know which col to start with,
  //work our way back up, checking at most 3 cels per row
  for (var row=vertDmap.length-2; row >= 0; row--) {
    minVal = Number.MAX_SAFE_INTEGER;
    for(var col=minCol-1; col < minCol+2; col++) {
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

function removeSeam(img, seam) {
  var tmp = new p5.Image(img.width, img.height);
  tmp.copy(img, 0, 0, img.width, img.height, 0, 0, tmp.width, tmp.height);
  tmp.loadPixels();

  for (var row=0; row < img.height; row++) {
    var colOffset = 0;
    for (var col=0; col< img.width; col++) {
      if (col == seam[row]) {
        colOffset = -1;
        col++;
      }
      if (col < carveWidth) {
        var tpx = (row * img.width)*4 + col*4;
        var ipx = (row * tmp.width)*4 + (col+colOffset)*4;
        img.pixels[ipx] = tmp.pixels[tpx];
        img.pixels[ipx+1] = tmp.pixels[tpx+1];
        img.pixels[ipx+2] = tmp.pixels[tpx+2];
        //tmp.pixels[tpx] = img.pixels[ipx];
      }
      else {
        //print("edge col: " + col);
        img.pixels[ipx] = 0;
        img.pixels[ipx+1] = 0;
        img.pixels[ipx+2] = 0;
      }
    }
  }
  carveWidth--;
  //img.resize(img.width-1, img.height);
  //img.updatePixels();
  return img;
}


/*
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
*/

function getNeighborGradient1(img, r,  c) {
  var xgradient = new Array(3);
  var ygradient = new Array(3);
  var gradient = 0;
  var neighborPixel;
  var px = (r*img.width)*4 + c*4;
  var pixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);

  if (r != 0) {
    px = ((r-1)*img.width)*4 + c*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  else {
    px = ((img.height-1)*img.width)*4 + c*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  ygradient[0] = abs(red(pixel) - red(neighborPixel));
  ygradient[1] = abs(green(pixel) - green(neighborPixel));
  ygradient[2] = abs(blue(pixel) - blue(neighborPixel));

  if (r != img.height-1) {
    px = ((r+1)*img.width)*4 + c*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  else {
    neighborPixel = color(img.pixels[c*4],img.pixels[c*4+1],img.pixels[c*4+2]);
    //neighborPixel = img.pixels[c];
  }
  ygradient[0]+= abs(red(pixel) - red(neighborPixel));
  ygradient[1]+= abs(green(pixel) - green(neighborPixel));
  ygradient[2]+= abs(blue(pixel) - blue(neighborPixel));
  if ( c != 0 ){
    px = (r*img.width)*4 + (c-1)*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  else {
    px = (r*img.width)*4 + (img.width-1)*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  xgradient[0] = abs(red(pixel) - red(neighborPixel));
  xgradient[1] = abs(green(pixel) - green(neighborPixel));
  xgradient[2] = abs(blue(pixel) - blue(neighborPixel));
  if (c != img.width-1) {
    px = (r*img.width)*4 + (c+1)*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  else {
    px = (r*img.width)*4;
    neighborPixel = color(img.pixels[px],img.pixels[px+1],img.pixels[px+2]);
  }
  xgradient[0]+= abs(red(pixel) - red(neighborPixel));
  xgradient[1]+= abs(green(pixel) - green(neighborPixel));
  xgradient[2]+= abs(blue(pixel) - blue(neighborPixel));
  for(var i=0; i<3;i++) {
    gradient+= ygradient[i] + xgradient[i];
  }

  return int(gradient);
}

/*
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
*/

function getTotalDifference(neighbors, pc) {
  var diff = 0;
  for (var n=0; n < neighbors.length; n++) {
    var tmp = neighbors[0];
    diff+= abs(red(pc) - red(tmp));
    diff+= abs(green(pc) - green(tmp));
    diff+= abs(blue(pc) - blue(tmp));
  }
  return diff;
}//getTotalDifference



function grayScale(art) {
  var tmp = new p5.Image(art.width, art.height);
  tmp.copy(art, 0, 0, art.width, art.height, 0, 0, tmp.width, tmp.height);
  tmp.loadPixels();

 var gray = 0;
 for (var row=0; row < art.height; row++) {
   for (var col=0; col< art.width; col++) {
     var px = (row * art.width)*4 + col*4;
     //var pc = art.pixels[px];
     var pc = color(tmp.pixels[px], tmp.pixels[px+1], tmp.pixels[px+2]);
     gray = int((red(pc) + green(pc) + blue(pc))/3);
     //print(gray);
     art.pixels[px] = gray;
     art.pixels[px+1] = gray;
     art.pixels[px+2] = gray;
   }
 }
 art.updatePixels();
 return art;
}

/*
  //grayscale version using set() and get()... it SLOW
 function grayScale(art) {
  var tmp = new p5.Image(art.width, art.height);
  tmp.loadPixels();
  var gray = 0;
  for (var row=0; row < art.height; row++) {
    for (var col=0; col< art.width; col++) {
      //var px = (row * art.width) + col;
      //var pc = art.pixels[px];
      var pc = art.get(col, row);
      gray = int((red(pc) + green(pc) + blue(pc))/3);
      //tmp.pixels[px] = color(gray, gray, gray);
      tmp.set(col, row, color(gray));
    }
  }
  print('gray done!');
  return tmp;
}
*/


function edgeDetect(img) {
  var tmp = new p5.Image(img.width, img.height);
  tmp.copy(img, 0, 0, img.width, img.height, 0, 0, tmp.width, tmp.height);
  tmp.loadPixels();
  tmp = grayScale(tmp);
  averageDiff = 0;
  for (var row=0; row < tmp.height; row++) {
    for (var col=0; col< tmp.width; col++) {
      var px = (row * tmp.width)*4 + col*4;

      var pc = color(tmp.pixels[px], tmp.pixels[px+1], tmp.pixels[px+2]);
      neighborColors = getNeighborColors(tmp, row, col);
      var difference = getDifference(neighborColors, pc);
      averageDiff+= difference;
      if (difference < THRESHHOLD) {
        img.pixels[px] = 0;
        img.pixels[px+1] = 0;
        img.pixels[px+2] = 0;
      }
      else {
        img.pixels[px] = 255;
        img.pixels[px+1] = 255;
        img.pixels[px+2] = 255;
      }
    }
  }
  averageDiff = averageDiff/(img.width * img.height);
  print(averageDiff);
  img.updatePixels();
  return img;
}

//var px = (row * tmp.width)*4 + col*4;

 function getNeighborColors(img, r, c) {
  var neighborColors = new Array();
  var neighborPixel;
  var neighborColor;
  if (r != 0) {
    neighborPixel = ((r-1) * img.width)*4 + c*4;
    neighborColor = color(img.pixels[neighborPixel], img.pixels[neighborPixel+1], img.pixels[neighborPixel+2]);
    neighborColors.push(neighborColor);
  }
  if (r != img.height-1) {
    neighborPixel = ((r+1) * img.width)*4 + c*4;
    neighborColor = color(img.pixels[neighborPixel], img.pixels[neighborPixel+1], img.pixels[neighborPixel+2]);
    neighborColors.push(neighborColor);
  }
  if ( c != 0 ){
    neighborPixel = (r* img.width)*4 + (c-1)*4;
    neighborColor = color(img.pixels[neighborPixel], img.pixels[neighborPixel+1], img.pixels[neighborPixel+2]);
    neighborColors.push(neighborColor);
  }
  if (c != img.width-1) {
    neighborPixel = (r * img.width)*4 + (c+1)*4;
    neighborColor = color(img.pixels[neighborPixel], img.pixels[neighborPixel+1], img.pixels[neighborPixel+2]);
    neighborColors.push(neighborColor);
  }
  return neighborColors;
}

function getDifference(neighborColors, pc) {
  var diff = 0;

  for (var n=0; n < neighborColors.length; n++) {
      diff+= abs(brightness(neighborColors[n]) - brightness(pc));
  }
  return diff/neighborColors.length;
}
