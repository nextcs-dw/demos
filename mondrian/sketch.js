function setup() {

  createCanvas(400, 400);
  background(255);
  var x, y, h, w;
  var c;
  for (var i=0; i < 100; i++) {
    var r = int(random(5));
    if (r == 0)
      c = 255;
    else if (r == 1)
      c = 0;
    else if (r == 2)
      c = color(255, 0, 0);
    else if (r == 3)
      c = color(0, 0, 255);
    else
      c = color(255, 255, 0);
    fill(c);
    x = int(random(0, width));
    y = int(random(0, height));
    w = int(random(0, 100));
    h = int(random(0, 100));
    rect(x, y, w, h);
  }
}
