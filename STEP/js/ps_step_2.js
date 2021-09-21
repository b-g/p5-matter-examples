Homeworks.aufgabe = 2;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');
}

function draw() {
  background(40, 10);
  let c = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
  fill(c);
  ellipse(Math.random() * windowWidth, Math.random() * windowHeight, 20, 20);
}
